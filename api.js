//Changed the URL in the fetch method.
export async function fetchChallenges() {
    const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges', {
        headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
        throw new Error(res.status + ' Could not load challenges ' + res.statusText);
    }

    const data = await res.json();
    return data.challenges;
}

// Added parameter 'date' to the function
export async function getAvailableTimes(date, challengeID) {
    const res = await fetch(`https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${date}&challenge=${challengeID}`);

    if(!res.ok) {
        throw new Error(res.status + ' Could not fetch available times ' + res.statusText);
    }

    return await res.json();
    
}

// Changed parameter from 'data' to 'bookingData'
export async function postBooking(bookingData) {
     try {
        const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/booking/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challenge: parseInt(bookingData.challengeId),
                name: bookingData.fullName,
                email: bookingData.email,
                date: bookingData.date,
                time: bookingData.time,
                participants: parseInt(bookingData.participants)
            }),
        });
        const resData = await res.json();
        console.log(resData);
    } catch (error) {
        console.error('Booking failed:', error);
    }
}