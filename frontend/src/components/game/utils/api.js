export async function patchUser(id, update) {
    const response = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
}
