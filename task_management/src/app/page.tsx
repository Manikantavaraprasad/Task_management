'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      // Reset form only when opening the modal
      setFullName('');
      setEmail('');
      setPassword('');
      setError('');
    }
  };
  const switchForm = () => setIsRegistering(!isRegistering);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await await response.json();

      if (response.ok) {
        // Registration/Login successful
        if (isRegistering) {
          Swal.fire({
            icon: 'success',
            title: 'Successfully registered!',
            text: 'Please login with your credentials.',
            confirmButtonText: 'OK',
          }).then(() => {
            setIsRegistering(false); // Switch to login form
            toggleModal(); // Close modal after registration
          });
        } else {
          // Store the token in local storage or a cookie
          localStorage.setItem('token', data.token);
          // Redirect to dashboard or a logged-in state
          router.push('/dashboard');
        }
      } else {
        // Improved error handling
        if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          setError(data.errors[0].msg || 'An error occurred');
        } else if (data && data.message) {
          setError(data.message); // Use a general message if specific errors are not provided
        } else {
          setError(`Request failed with status: ${response.status}`);
        }
      }
    }  catch (err: unknown) {
  setError('Failed to connect to the server');

  if (err instanceof Error) {
    console.error('Fetch error:', err.message);
  } else {
    console.error('Unknown fetch error:', err);
  }
}finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo2.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Task Management
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-full max-w-md mx-auto rounded-lg p-8 relative shadow-xl">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              {isRegistering ? 'Register' : 'Login'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              {isRegistering && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                {isRegistering ? 'Already have an account?' : 'New user?'}{' '}
                <button
                  onClick={switchForm}
                  className="text-blue-600 hover:underline"
                >
                  {isRegistering ? 'Login here' : 'Register here'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Main content (rest of your sections remain unchanged) */}
        {/* Hero, Features, About, Contact, Footer */}
        {/* ... */}

        {/* Hero */}
        <main className="flex-grow">
          <section className="text-center py-24 px-4 bg-gradient-to-br from-blue-100 to-white">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Organize, Track, and Succeed
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              The ultimate task management system to help your team stay on top of goals and deadlines.
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </motion.div>
          </section>

          {/* Features */}
          <section id="features" className="py-16 bg-white">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Features</h2>
            <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  title: 'Task Boards',
                  desc: 'Create and manage task boards for different projects and teams.',
                },
                {
                  title: 'Team Collaboration',
                  desc: 'Assign tasks, leave comments, and work together seamlessly.',
                },
                {
                  title: 'Real-time Updates',
                  desc: 'Stay notified with live updates, reminders, and progress tracking.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-6 border rounded-md hover:shadow-lg transition bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* About */}
          <section id="about" className="py-24 bg-blue-50 px-6">
            <div className="max-w-6xl mx-auto text-center md:text-left">
              <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
                About Task Management
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Why We Exist
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our platform is built to help teams and individuals
                    collaborate efficiently and manage their time effectively.
                    Whether you’re managing a small team or a large enterprise,
                    our tools scale with your needs.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To simplify task management through intuitive interfaces,
                    real-time updates, and collaborative features. We are on a
                    mission to help people get more done with less stress.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="py-24 bg-white px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                Have a question, want a demo, or need support? We are here to
                help. You can reach us anytime, and we’ll respond as quickly as
                possible.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                <div className="bg-blue-50 p-6 rounded shadow hover:shadow-md transition">
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    📩 Email Us
                  </h4>
                  <p className="text-gray-600">support@taskmanager.com</p>
                </div>
                <div className="bg-blue-50 p-6 rounded shadow hover:shadow-md transition">
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    🌐 Headquarters
                  </h4>
                  <p className="text-gray-600">Remote-first, serving globally</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-300 pt-12 pb-6 mt-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/logo2.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-white mb-3">
                TaskManagement
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Simplify your workflow and manage projects with ease. Trusted by
                teams around the world.
              </p>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Follow Us
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Task Management System. All rights
            reserved.
          </div>
        </footer>
      </div>
    );
  }
