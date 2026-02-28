export async function fetchCurrentUser() : Promise <{username : string}> {
    const token = localStorage.getItem('token');

    if(!token) throw new Error('No auth token found!');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(!res.ok){
        throw new Error('Failed to fetch current user');
    }

    console.log('Status:', res.status);

    const data = await res.json();
    return {username: data.username};
}