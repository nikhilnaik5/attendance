import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Home = () => {
    const [subject, setSubject] = useState("");
    const [numsubj, setNumber] = useState("");
    const [attendance, setAttendance] = useState([]);
    // const [array, setArray] = useState([]);

    useEffect(() => {
        async function getPercentage() {
            const token = localStorage.getItem('token');
            await axios.get("http://localhost:5000/lecture/", { headers: { 'Authorization': token } }).then(res => {
                setSubject(res.data[0])
                setNumber(((res.data[0][0]).length) - 1)
                for (var i = 1; i <= res.data[0][0].length - 1; i++) {
                    let temp = [];
                    let data = res.data[0][res.data[0].length - 2][i][0] / res.data[0][res.data[0].length - 2][i][1]
                    temp.push(res.data[0][0][i]);
                    temp.push((data * 100).toFixed(2));
                    temp.push(res.data[0][res.data[0].length - 2][i][0]);
                    temp.push(res.data[0][res.data[0].length - 2][i][1])
                    attendance.push(temp);
                }
            })
        }
        getPercentage()
    }, [])



    return (
        <div>
            <div>{attendance.map((sub) =>
                        <div class="flex flex-basis-2 py-2">
                            <div class="px-2 basis-1/2">
                                <div class="flex flex-col h-full">
                                    <p class="pt-2 mb-1 text-lg font-bold">{sub[0]}</p>
                                    <h5 class="font-normal">Attended: {sub[2]}</h5>
                                    <h5 class="font-normal">Lectures: {sub[3]}</h5>
                                </div>
                            </div>
                            <div class="basis-1/2 px-2 w-full">
                                {(() => {
                                    if ((sub[1] < 75.0)) {
                                        return (
                                            <div class="h-full bg-gradient-to-tl from-red-700 to-red-500 rounded-xl">
                                                <div class="relative flex items-center justify-center h-full">
                                                    <div className='text-2xl font-bold text-white'>{sub[1]}%</div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div class="h-full bg-gradient-to-tl from-green-800 to-green-500 rounded-xl">
                                                <div class="relative flex items-center justify-center h-full">
                                                    <div className='text-2xl font-bold text-white'>{sub[1]}%</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                        </div>

            )}</div>

        </div>

    )
}

export default Home