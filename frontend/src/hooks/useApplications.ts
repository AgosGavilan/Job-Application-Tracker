import { useState, useEffect } from 'react';
import { applicationsService } from '../services/api';
import type { Application } from '../types';

export const useApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statsVersion, setStatsVersion] = useState(0);

    const bump = () => setStatsVersion((v) => v + 1);

    // ─── CARGAR TODAS ─────────────────────────────────────────
    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await applicationsService.getAll();
            setApplications(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al cargar postulaciones');
        } finally {
            setLoading(false);
        }
    };

    // ─── CREAR ────────────────────────────────────────────────
    const createApplication = async (data: Partial<Application>) => {
        try {
            const response = await applicationsService.create(data);
            setApplications((prev) => [response.data, ...prev]);
            bump();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Error al crear' };
        }
    };

    // ─── ACTUALIZAR ───────────────────────────────────────────
    const updateApplication = async (id: number, data: Partial<Application>) => {
        try {
            const response = await applicationsService.update(id, data);
            setApplications((prev) =>
                prev.map((app) => (app.id === id ? response.data : app))
            );
            bump();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Error al actualizar' };
        }
    };

    // ─── ELIMINAR ─────────────────────────────────────────────
    const deleteApplication = async (id: number) => {
        try {
            await applicationsService.delete(id);
            setApplications((prev) => prev.filter((app) => app.id !== id));
            bump();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.error || 'Error al eliminar' };
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return {
        applications,
        loading,
        error,
        createApplication,
        updateApplication,
        deleteApplication,
        refetch: fetchApplications,
        statsVersion
    };
}

