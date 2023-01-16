import React, { useEffect, useState } from 'react'
import axios from 'axios';
import alldone from '../images/Ok-amico.png'
import { useNavigate } from 'react-router-dom';
const Enroll = () => {
  let navigate = useNavigate();
  const [subjectList, setsubjectlist] = useState([]);
  useEffect(() => {
    async function getSubjectNames() {
      let token = localStorage.getItem('token');
      await axios.get('/lecture/getsubjectnames', {
        headers: { Authorization: token }
      }).then((res) => { setsubjectlist(res.data); console.log(res.data) }).catch((err) => { console.log(err) });
    }
    getSubjectNames();
  }, [])
  const enrollSubject = async (idx) => {
    let token = localStorage.getItem('token');
    let data = { "subject": subjectList[idx].name };
    // console.log(subject);
    await axios.post('/lecture/enrollcourse', data, {
      headers: {
        Authorization: token
      }
    }).then((res) => { console.log(res); });
    window.location.reload();
  }
  const nav = () => {
    let path = '/home';
    navigate(path);
  }
  return (
    <div>
      {subjectList.length == 0 ?
        <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
          <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
            <div class="relative">
              <div class="absolute">
                <div class="">
                  <h1 class="my-2 text-gray-800 font-bold text-2xl">
                    Looks like you've no more subjects to enroll
                  </h1>
                  <p class="my-2 text-gray-800">Please visit our hompage to see you attendance status</p>
                  <button class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" onClick={nav}>Take me there!</button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src={alldone} width={375} />
          </div>
        </div> : subjectList.map((sub, idx) => {
          return <div>
            <div className="mx-4 my-4 flex flex-basis max-w-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 ">
              <h5 className="basis-1/2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{sub.name}</h5>
              <button className="basis-1/2 max-w-sm inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center" onClick={() => { enrollSubject(idx) }}>
                Enroll
              </button>
            </div>
          </div>
        })}
    </div>
  )
}

export default Enroll