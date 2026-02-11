import Papa from 'papaparse';
import type { NewsItem, DashboardStats } from '../types';
import { isSameDay } from 'date-fns';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1rRlKv2pwVDZTYfJ5UnMwhrKYv9MEX6Wc3q8gDT1KH3g/export?format=csv';

interface RawRow {
    วันเวลา: string;
    UserID: string;
    ตำบล: string;
    ข้อความ: string;
}

export const fetchNewsData = async (): Promise<NewsItem[]> => {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const text = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse<RawRow>(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data.map((row, index) => {
                        const dateStr = row['วันเวลา'];

                        let timestamp = new Date();
                        try {
                            const [datePart, timePart] = dateStr.split(', ');
                            const [day, month, year] = datePart.split('/');
                            timestamp = new Date(`${year}-${month}-${day}T${timePart}`);
                        } catch (e) {
                            console.warn("Date parse error", dateStr);
                        }

                        const message = row['ข้อความ'] || '';
                        const linkMatch = message.match(/(https?:\/\/[^\s]+)/g);
                        const link = linkMatch ? linkMatch[0] : undefined;

                        let type: NewsItem['type'] = 'text';
                        if (link && message.trim() === link) {
                            type = 'link';
                        } else if (link) {
                            type = 'mixed';
                        }

                        return {
                            id: `${row.UserID}-${index}`,
                            date: dateStr,
                            timestamp,
                            userId: row.UserID,
                            district: (row.ตำบล || 'N/A').trim(), // Ensure trimmed names
                            message: message,
                            link,
                            type
                        };
                    });

                    // Sort by timestamp desc
                    parsedData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                    resolve(parsedData);
                },
                error: (error: Error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Failed to fetch Google Sheet CSV", error);
        throw error;
    }
};

export const calculateStats = (data: NewsItem[]): DashboardStats => {
    const totalPosts = data.length;
    // Use today's date for "Daily Report"
    const today = new Date();

    // Create Master List of all unique districts from history
    const uniqueDistrictsSet = new Set(data.map(item => item.district).filter(d => d && d !== 'N/A'));
    const uniqueDistricts = Array.from(uniqueDistrictsSet).sort();

    // Filter today's posts
    const postsTodayItems = data.filter(item => isSameDay(item.timestamp, today));
    const postsToday = postsTodayItems.length;

    // Who submitted today?
    const submittedTodaySet = new Set(postsTodayItems.map(item => item.district));
    const submittedToday = Array.from(submittedTodaySet).sort();

    // Who is missing?
    const missingToday = uniqueDistricts.filter(d => !submittedTodaySet.has(d));

    const districtCountsMap = data.reduce((acc, item) => {
        const district = item.district || 'Unknown';
        acc[district] = (acc[district] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const districtCounts = Object.entries(districtCountsMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const activeDistrict = districtCounts.length > 0 ? districtCounts[0].name : '-';

    return {
        totalPosts,
        postsToday,
        activeDistrict,
        districtCounts,
        uniqueDistricts,
        submittedToday,
        missingToday
    };
};
