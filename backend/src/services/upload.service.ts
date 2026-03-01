import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { AppError } from '../middlewares/error.middleware';

export interface IParsedTask {
    firstName: string;
    phone: string;
    notes: string;
}

export const parseSpreadsheet = (filePath: string): IParsedTask[] => {
    try {
        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) {
            throw new AppError(404, 'File not found for parsing');
        }

        const workbook = XLSX.readFile(fullPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        // Map and validate headers
        return rawData.map((row: any) => {
            // Support multiple possible header casings
            const firstName = row.FirstName || row.firstname || row['First Name'] || '';
            const phone = row.Phone || row.phone || row['Phone Number'] || '';
            const notes = row.Notes || row.notes || '';

            if (!firstName || !phone) {
                // We'll filter these out or keep them empty depending on requirement
            }

            return {
                firstName: String(firstName).trim(),
                phone: String(phone).trim(),
                notes: String(notes).trim()
            };
        }).filter(item => item.firstName && item.phone); // Only keep valid rows

    } catch (error: any) {
        throw new AppError(500, `Failed to parse file: ${error.message}`);
    } finally {
        // Clean up file after parsing if desired (optional)
        // fs.unlinkSync(filePath);
    }
};

export const distributeTasks = (tasks: IParsedTask[], agents: any[]): any[] => {
    const totalTasks = tasks.length;
    const totalAgents = agents.length;

    if (totalAgents === 0) return [];

    const baseCount = Math.floor(totalTasks / totalAgents);
    const remainder = totalTasks % totalAgents;

    let currentIndex = 0;
    const distributedData: any[] = [];

    agents.forEach((agent, index) => {
        // First 'remainder' agents get baseCount + 1, others get baseCount
        const countForThisAgent = index < remainder ? baseCount + 1 : baseCount;

        const agentTasks = tasks.slice(currentIndex, currentIndex + countForThisAgent);

        agentTasks.forEach(task => {
            distributedData.push({
                ...task,
                agentId: agent._id
            });
        });

        currentIndex += countForThisAgent;
    });

    return distributedData;
};
