// services/leadAdmission.api.js

import api from "../utils/api.js";

export const getLeads = (params) => api.get("/lead", { params });

export const createLead = (data) => api.post("/lead", data);

export const updateLead = (id, data) => api.put(`/lead/${id}`, data);

export const deleteLead = (id) => api.delete(`/lead/${id}`);