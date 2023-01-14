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
            await axios.get("/lecture/", { headers: { 'Authorization': token } }).then(res => {
                setSubject(res.data[0])
                setNumber(((res.data[0][0]).length) - 1)
                console.log(res.data[0])
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
                        <div className="flex flex-basis-2 py-2">
                            <div className="px-2 basis-1/2">
                                <div className="flex flex-col h-full">
                                    <p className="pt-2 mb-1 text-lg font-bold">{sub[0]}</p>
                                    <h5 className="font-normal">Attended: {sub[2]}</h5>
                                    <h5 className="font-normal">Lectures: {sub[3]}</h5>
                                </div>
                            </div>
                            <div className="basis-1/2 px-2 w-full">
                                {(() => {
                                    if ((sub[1] < 75.0)) {
                                        return (
                                            <div className="h-full bg-gradient-to-tl from-red-700 to-red-500 rounded-xl">
                                                <div className="relative flex items-center justify-center h-full">
                                                    <div className='text-2xl font-bold text-white'>{sub[1]}%</div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="h-full bg-gradient-to-tl from-green-800 to-green-500 rounded-xl">
                                                <div className="relative flex items-center justify-center h-full">
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