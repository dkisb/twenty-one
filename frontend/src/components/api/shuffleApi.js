import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem('jwtToken');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function fetchNextCard(order) {
  const res = await fetch(`${API_URL}/api/shuffle/getnext?order=${order}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to draw card.');
  return res.json();
}

async function startShuffle() {
  const res = await fetch(`${API_URL}/api/shuffle`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to start shuffle.');
  return res.json();
}

export function useDrawCard() {
  return useMutation({ mutationFn: fetchNextCard });
}

export function useNewShuffle() {
  return useMutation({ mutationFn: startShuffle });
}