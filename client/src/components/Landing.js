import React from 'react'
import Landing1 from '../images/landing1.jpg'
import Landing2 from '../images/landing2.jpg'
import Landing3 from '../images/landing3.jpg'
import Landing4 from '../images/landing4.jpg'

const Landing = () => {
    return (
        <div>
            <div class="py-10 bg-gray-50 overflow-hidden h-full">
                <div class="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
                    <div>
                        <span class="text-gray-600 text-lg font-semibold">Attendance Tracker</span>
                        <h2 class="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">To maintain your attendance</h2>
                    </div>
                    <div class="mt-16 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
                        <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                            <div class="relative p-8 space-y-8">
                                <img src={Landing1} width="512" height="512" alt="burger illustration"/>

                                    <div class="space-y-2">
                                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-blue-600">Till Date Attendance</h5>
                                        <p class="text-sm text-gray-600">Get attendance till current date</p>
                                    </div>
                            </div>
                        </div>
                        <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                            <div class="relative p-8 space-y-8">
                                <img src={Landing2} width="512" height="512" alt="burger illustration"/>

                                    <div class="space-y-2">
                                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-blue-600">Subjectwise Timeline</h5>
                                        <p class="text-sm text-gray-600">Get a timeline of lectures and attendance percentage datewise</p>
                                    </div>
                            </div>
                        </div>
                        <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                            <div class="relative p-8 space-y-8">
                                <img src={Landing3} width="512" height="512" alt="burger illustration"/>

                                    <div class="space-y-2">
                                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-blue-600">Predict Future Attendance</h5>
                                        <p class="text-sm text-gray-600">Predict your future attendance and see how the attendance varies</p>
                                    </div>
                            </div>
                        </div>
                        <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                            <div class="relative p-8 space-y-8">
                                <img src={Landing4} width="512" height="512" alt="burger illustration"/>

                                    <div class="space-y-2">
                                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-blue-600">Add Absent Days </h5>
                                        <p class="text-sm text-gray-600">Manage your own presence</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing