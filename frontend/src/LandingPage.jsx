import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './LandingPage.css';

const LandingPage = () => {
    const features = [
        {
            title: "AI Chatbot Assistant",
            description: "Get instant help with our 24/7 AI tutor that understands your questions and provides personalized explanations.",
            icon: "🤖"
        },
        {
            title: "Progress Dashboard",
            description: "Track your learning journey with detailed analytics and visual progress reports.",
            icon: "📊"
        },
        {
            title: "Leaderboard",
            description: "Compete with peers and stay motivated with our achievement-based ranking system.",
            icon: "🏆"
        },
        {
            title: "Interactive Courses",
            description: "Engaging multimedia content designed to make learning effective and enjoyable.",
            icon: "🎓"
        }
    ];

    return (
        <div className="landing-container">
            <header className="hero-section">
                <h1 className="hero-title">Welcome to the Student-Instructor Platform</h1>
                <p className="hero-subtitle">Connect, learn, and grow together!</p>
                <div className="cta-buttons">
                    <Link to="/login" className="cta-button login">Login</Link>
                    <Link to="/signup" className="cta-button signup">Sign Up</Link>
                </div>
            </header>

            <div className="carousel-section">
                <Carousel 
                    autoPlay 
                    infiniteLoop 
                    interval={5000} 
                    showThumbs={false} 
                    showStatus={false}
                    className="main-carousel"
                >
                    <div className="carousel-slide">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                             alt="Students learning together" />
                        <div className="carousel-overlay">
                            <h3>Collaborative Learning</h3>
                            <p>Join a community of learners and educators</p>
                        </div>
                    </div>
                    <div className="carousel-slide">
                        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                             alt="AI technology" />
                        <div className="carousel-overlay">
                            <h3>AI-Powered Assistance</h3>
                            <p>Get help anytime with our smart chatbot</p>
                        </div>
                    </div>
                    <div className="carousel-slide">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                             alt="Data analytics dashboard" />
                        <div className="carousel-overlay">
                            <h3>Track Your Progress</h3>
                            <p>Visualize your learning journey with our analytics</p>
                        </div>
                    </div>
                </Carousel>
            </div>

            <section className="features-section">
                <h2 className="section-title">Platform Features</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="testimonial-section">
                <h2 className="section-title">What Our Users Say</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <p>"The AI assistant helped me understand complex concepts when my instructor wasn't available."</p>
                        <div className="testimonial-author">- Karan, Computer Science Student</div>
                    </div>
                    <div className="testimonial">
                        <p>"The progress dashboard keeps my students motivated and helps me identify who needs extra help."</p>
                        <div className="testimonial-author">- Prof. Lokhande, Mathematics Instructor</div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>Ready to start your learning journey?</p>
                <Link to="/signup" className="cta-button">Get Started Now</Link>
            </footer>
        </div>
    );
};

export default LandingPage;