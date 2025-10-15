import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(includeAuth = true) {
  const base = { 'Content-Type': 'application/json' };
  if (!includeAuth) return base;
  const token = localStorage.getItem('jwtToken');
  return { ...base, Authorization: `Bearer ${token}` };
}

/* ---------- CORE REQUEST HELPERS ---------- */
async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data;
}

/* ---------- AUTH ---------- */
async function loginUser({ username, password }) {
  const res = await fetch(`${API_URL}/api/user/login`, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res, 'Login failed.');
  if (data.jwt) localStorage.setItem('jwtToken', data.jwt);
  return data;
}

async function registerUser({ username, password, email }) {
  const res = await fetch(`${API_URL}/api/user/register`, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: JSON.stringify({ username, password, email }),
  });
  return handleResponse(res, 'Registration failed.');
}

/* ---------- FETCH PROFILE ---------- */
async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/api/user/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res, 'Failed to fetch user profile.');
}

/* ---------- UPDATE STATS ---------- */
async function updateUserStats(payload) {
  const res = await fetch(`${API_URL}/api/user/update`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res, 'Failed to update user stats.');
}

/* ---------- PATCH PROFILE ---------- */
async function patchUserProfile(payload) {
  const res = await fetch(`${API_URL}/api/user/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res, 'Failed to update user profile.');
}

/* ---------- DELETE ACCOUNT ---------- */
async function deleteUser() {
  const res = await fetch(`${API_URL}/api/user/delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res, 'Failed to delete user.');
  localStorage.removeItem('jwtToken');
  return data;
}

/* ---------- REACT QUERY HOOKS ---------- */
export function useLogin({ onSuccess, onError } = {}) {
  return useMutation({ mutationFn: loginUser, onSuccess, onError });
}

export function useRegister({ onSuccess, onError } = {}) {
  return useMutation({ mutationFn: registerUser, onSuccess, onError });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserStats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUserStats,
    onSuccess: () => qc.invalidateQueries(['user']),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchUserProfile,
    onSuccess: () => qc.invalidateQueries(['user']),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.removeQueries(['user']);
      localStorage.removeItem('jwtToken');
    },
  });
}

/* ---------- OPTIONAL DIRECT FETCH ---------- */
export async function getUserProfile() {
  return fetchUserProfile();
}