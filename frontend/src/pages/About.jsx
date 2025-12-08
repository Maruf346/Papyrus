import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaGithub, FaLinkedin } from "react-icons/fa"

const About = () => {

    const team = [
        {
            name: "Maruf Hossain",
            role: "Backend Developer | CSE Student",
            image: "/maruf.jpg",
            bio: "Passionate about backend development, AI systems, research tools, and building scalable applications.",
            github: "https://github.com/Maruf346/",
            linkedin: "https://www.linkedin.com/in/marufcse318/"
        },
        {
            name: "Punni",
            role: "Frontend Developer | UI Enthusiast",
            image: "/punni.png",
            bio: "Focused on modern UI/UX, responsive design, and bringing ideas to life with clean code.",
            github: "https://github.com/punniakter",
            linkedin: "https://www.linkedin.com/in/punni-akter-538b79237/"
        }
    ]

    return (
        <>
            <Header />

            {/* Top Section */}
            <section className="w-full py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                        About Us
                    </h1>

                    <p className="text-lg sm:text-xl text-stone-600 leading-relaxed">
                        Papyrus is the all-in-one research platform for students,
                        educators, and researchers.
                    </p>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="w-full py-14 bg-stone-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
                        Our Commitment
                    </h2>

                    <p className="text-lg text-stone-700 leading-relaxed">
                        Thank you for choosing our website as your trusted research platform.
                        We are dedicated to continually improving our tool and providing you
                        with an exceptional research experience.
                        <br /><br />
                        If you have any questions or feedback, feel free to contact us at:
                        <span className="font-semibold text-stone-900"> maruf.bshs@gmail.com</span>
                    </p>
                </div>
            </section>

            {/* ⭐ Our Team Section */}
            <section className="w-full py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    
                    <h2 className="text-3xl sm:text-4xl font-semibold text-center text-stone-900 mb-12">
                        ⭐ Meet Our Team ⭐
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-stone-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow"
                                />

                                <h3 className="text-2xl font-semibold text-stone-900">{member.name}</h3>
                                <p className="text-stone-600 text-sm mb-3">{member.role}</p>

                                <p className="text-stone-700 text-sm leading-relaxed mb-4">
                                    {member.bio}
                                </p>

                                <div className="flex items-center justify-center gap-5 text-xl text-stone-700">
                                    <a 
                                        href={member.github} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:text-stone-900"
                                    >
                                        <FaGithub />
                                    </a>

                                    <a 
                                        href={member.linkedin} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="hover:text-stone-900"
                                    >
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </>
    )
}

export default About
