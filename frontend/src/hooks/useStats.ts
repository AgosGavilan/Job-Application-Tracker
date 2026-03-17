import { useState, useEffect } from 'react';
import api from '../services/api';

interface StatusCount {
    status: string;
    count: number;
}

interface Summary {
    total: number;
    byStatus: StatusCount[];
    responseRate: number;
    avgResponseDays: number;
}

interface WeeklyData {
    week: string;
    count: number;
}

export const useStats = (refetchTrigger?: number) => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [weekly, setWeekly] = useState<WeeklyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [summaryRes, weeklyRes] = await Promise.all([
                    api.get('/stats/summary'),
                    api.get('/stats/weekly'),
                ]);
                setSummary(summaryRes.data);
                setWeekly(weeklyRes.data);
            } catch (err) {
                console.error('Error al cargar stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [refetchTrigger]);

    return { summary, weekly, loading };
}; 