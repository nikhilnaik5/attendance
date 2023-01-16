import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Absent = () => {
    const [message, setMessage] = useState(null);
    const [subjects, setSubject] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [absent,setAbsent] = useState({subject:"",date:null,number:null})

    let name ,value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
    
        setAbsent({ ...absent, [name]: value });
      }

    async function getDetails() {
        let token = localStorage.getItem('token')
        await axios.get("/lecture/getenrolledlist", { headers: { 'Authorization': token } }).then((res) => { setSubject(res.data); console.log(res.data) }).catch("No successful result");
    }

    const sendAbsent = async ()=>{
        absent.subject = subjects[selectedOption];
        let token = localStorage.getItem('token');
        console.log(absent);
        await axios.post('/lecture/absent',absent, { headers: { 'Authorization': token } }).then((res)=>{
            setMessage(res.data.message)
        }).catch((err)=>setMessage(err.response.data.message));
    }

    useEffect(() => {
        getDetails();
    }, [])

    return (
        <div>
            {message == null ? null : <div class="m-5 flex p-4 mb-4 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Info</span>
                <div>
                    {message}
                </div>
            </div>}
            <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Select Subject:</div><select className='rounded-sm border-2 border-sky-500 basis-1/2' onChange={e => setSelectedOption(e.target.value)} value={selectedOption}>
                    {subjects.map((sub, idx) => <option value={idx}>{sub}</option>)}
                </select>
            </div>
            <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Select Date:</div><input className='rounded-sm border-2 border-sky-500 basis-1/2' type='date' name="date" value={absent.date} onChange={handleInputs}/>
            </div>
            <div className='flex flex basis w-1/2 py-2 px-2'>
                <div className='basis-1/2 font-bold'>Number of Lectures:</div><input className='rounded-sm border-2 border-sky-500 basis-1/2' type='number' name="number" value={absent.number} onChange={handleInputs}/>
            </div>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={sendAbsent}>Add Absent</button>
        </div>
    )
}

export default Absent