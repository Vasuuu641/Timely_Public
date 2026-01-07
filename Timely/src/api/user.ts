export async function fetchCurrentUser() : Promise <{username : string}> {
    const token = localStorage.getItem('token');

    if(!token) throw new Error('No auth token found!');

    const res = await fetch('http://localhost:3000/user/me', {
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