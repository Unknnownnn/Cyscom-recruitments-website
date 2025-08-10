// Animated Department Selector with Scroll-Linked Animation
// Using React with CSS animations for better compatibility

const { useState, useEffect, useRef } = React;

// Department data with colors and descriptions
const departments = [
    {
        id: 'technical',
        name: 'Technical',
        description: 'CTFs, Ethical Hacking and more',
        color: '#ff6b6b',
        icon: './Images/Tech.png',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ff5722)'
    },
    {
        id: 'design',
        name: 'Design',
        description: 'UI/UX design and graphics',
        color: '#4ecdc4',
        icon: './Images/Design.png',
        gradient: 'linear-gradient(135deg, #4ecdc4, #26c6da)'
    },
    {
        id: 'dev',
        name: 'Development',
        description: 'Web development',
        color: '#45b7d1',
        icon: './Images/dEV.png',
        gradient: 'linear-gradient(135deg, #45b7d1, #2196f3)'
    },
    {
        id: 'social-media',
        name: 'Social Media',
        description: 'Social media management and digital marketing',
        color: '#f7b731',
        icon: './Images/SM.png',
        gradient: 'linear-gradient(135deg, #f7b731, #ff9800)'
    },
    {
        id: 'content',
        name: 'Content',
        description: 'Content creation, writing, and documentation',
        color: '#5f27cd',
        icon: './Images/Content.png',
        gradient: 'linear-gradient(135deg, #5f27cd, #673ab7)'
    },
    {
        id: 'event-management',
        name: 'Event Management',
        description: 'Event planning, coordination, and execution',
        color: '#00d2d3',
        icon: './Images/EM.png',
        gradient: 'linear-gradient(135deg, #00d2d3, #1dd1a1)'
    }
];

function AnimatedDepartmentSelector() {
    const containerRef = useRef(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Update hidden input when department is selected
    useEffect(() => {
        const hiddenInput = document.getElementById('department-hidden');
        if (hiddenInput && selectedDepartment) {
            hiddenInput.value = selectedDepartment.id;
            const event = new Event('change', { bubbles: true });
            hiddenInput.dispatchEvent(event);
        }
    }, [selectedDepartment]);

    // Handle scroll progress
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
            setScrollProgress(progress);
            
            // Update current index based on scroll
            const index = Math.round(progress * (departments.length - 1));
            setCurrentIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDepartmentClick = (department, index) => {
        setSelectedDepartment(department);
        
        // Scroll to center the selected department
        if (containerRef.current) {
            const cardWidth = 270; // card width + gap
            const containerWidth = containerRef.current.clientWidth;
            const scrollTo = (index * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
            containerRef.current.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
        }
    };

    return React.createElement('div', {
        style: {
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '20px auto',
            padding: '20px 0'
        }
    }, [
        // Progress indicator
        React.createElement('div', {
            key: 'progress-container',
            style: {
                position: 'absolute',
                top: '-70px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }
        }, 
            React.createElement('div', {
                style: {
                    width: '80px',
                    height: '80px',
                    position: 'relative'
                }
            }, [
                React.createElement('svg', {
                    key: 'progress-svg',
                    width: '80',
                    height: '80',
                    viewBox: '0 0 100 100',
                    style: { 
                        transform: 'rotate(-90deg)',
                        position: 'absolute'
                    }
                }, [
                    React.createElement('circle', {
                        key: 'bg-circle',
                        cx: '50',
                        cy: '50',
                        r: '30',
                        stroke: '#e0e0e0',
                        strokeWidth: '8',
                        fill: 'none'
                    }),
                    React.createElement('circle', {
                        key: 'progress-circle',
                        cx: '50',
                        cy: '50',
                        r: '30',
                        stroke: selectedDepartment ? selectedDepartment.color : '#667eea',
                        strokeWidth: '8',
                        fill: 'none',
                        strokeDasharray: '188.4', // 2 * π * 30
                        strokeDashoffset: `${188.4 * (1 - scrollProgress)}`,
                        style: {
                            transition: 'stroke 0.3s ease, stroke-dashoffset 0.1s ease'
                        }
                    })
                ])
            ])
        ),

        // Current department indicator
        React.createElement('div', {
            key: 'current-indicator',
            style: {
                textAlign: 'center',
                marginBottom: '30px',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
            }
        }, 
            selectedDepartment ? [
                React.createElement('img', {
                    key: 'selected-icon',
                    src: selectedDepartment.icon,
                    alt: selectedDepartment.name,
                    style: {
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        marginBottom: '15px',
                        animation: 'bounce 0.6s ease',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                    },
                    onError: (e) => {
                        // Fallback to emoji if image fails to load
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.textContent = '📁';
                        fallback.style.fontSize = '2.5rem';
                        fallback.style.marginBottom = '10px';
                        e.target.parentNode.insertBefore(fallback, e.target);
                    }
                }),
                React.createElement('h3', {
                    key: 'selected-name',
                    style: {
                        color: selectedDepartment.color,
                        margin: '0 0 8px 0',
                        fontSize: '1.4rem',
                        fontWeight: 'bold'
                    }
                }, selectedDepartment.name),
                React.createElement('p', {
                    key: 'selected-desc',
                    style: {
                        color: '#666',
                        margin: '0',
                        fontSize: '1rem',
                        fontStyle: 'italic'
                    }
                }, selectedDepartment.description)
            ] : [
                React.createElement('p', {
                    key: 'instruction',
                    style: {
                        color: '#999',
                        fontSize: '1.1rem',
                        margin: '0'
                    }
                }, 'Scroll through departments and click to select')
            ]
        ),

        // Scrollable department list
        React.createElement('div', {
            key: 'scroll-container',
            ref: containerRef,
            style: {
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#667eea rgba(255,255,255,0.2)',
                gap: '20px',
                padding: '20px 40px',
                cursor: 'grab',
                scrollSnapType: 'x mandatory',
                // Fade effect on edges
                maskImage: 'linear-gradient(90deg, transparent, black 20px, black calc(100% - 20px), transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 20px, black calc(100% - 20px), transparent)'
            },
            onMouseDown: (e) => e.currentTarget.style.cursor = 'grabbing',
            onMouseUp: (e) => e.currentTarget.style.cursor = 'grab',
            onMouseLeave: (e) => e.currentTarget.style.cursor = 'grab'
        }, 
            departments.map((dept, index) => 
                React.createElement('div', {
                    key: dept.id,
                    className: `department-card ${selectedDepartment?.id === dept.id ? 'selected-department' : ''}`,
                    onClick: () => handleDepartmentClick(dept, index),
                    style: {
                        minWidth: '250px',
                        height: '220px',
                        background: dept.gradient,
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        scrollSnapAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: selectedDepartment?.id === dept.id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: selectedDepartment?.id === dept.id 
                            ? `0 12px 30px ${dept.color}50, 0 0 0 3px ${dept.color}` 
                            : '0 6px 20px rgba(0,0,0,0.15)',
                        filter: selectedDepartment?.id === dept.id ? 'brightness(1.1)' : 'brightness(1)'
                    },
                    onMouseEnter: (e) => {
                        if (selectedDepartment?.id !== dept.id) {
                            e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 8px 25px ${dept.color}30`;
                        }
                    },
                    onMouseLeave: (e) => {
                        if (selectedDepartment?.id !== dept.id) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }
                    }
                }, [
                    React.createElement('img', {
                        key: 'icon',
                        src: dept.icon,
                        alt: dept.name,
                        style: {
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            marginBottom: '15px',
                            transition: 'transform 0.3s ease',
                            filter: 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        },
                        onError: (e) => {
                            // Fallback to default icon if image fails to load
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.textContent = '📁';
                            fallback.style.fontSize = '3rem';
                            fallback.style.marginBottom = '15px';
                            e.target.parentNode.insertBefore(fallback, e.target);
                        }
                    }),
                    React.createElement('h3', {
                        key: 'name',
                        style: {
                            margin: '0 0 12px 0',
                            fontSize: '1.4rem',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }
                    }, dept.name),
                    React.createElement('p', {
                        key: 'desc',
                        style: {
                            margin: '0',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            padding: '0 15px',
                            opacity: '0.95',
                            lineHeight: '1.3'
                        }
                    }, dept.description),
                    // Selection indicator
                    selectedDepartment?.id === dept.id && React.createElement('div', {
                        key: 'selected-indicator',
                        style: {
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            width: '35px',
                            height: '35px',
                            background: 'rgba(255,255,255,0.9)',
                            color: dept.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            animation: 'checkmark 0.5s ease'
                        }
                    }, '✓')
                ])
            )
        ),

        // Progress dots
        React.createElement('div', {
            key: 'progress-dots',
            style: {
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
            }
        },
            departments.map((_, index) => 
                React.createElement('div', {
                    key: index,
                    onClick: () => handleDepartmentClick(departments[index], index),
                    style: {
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: currentIndex === index ? '#667eea' : '#ddd',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: currentIndex === index ? 'scale(1.2)' : 'scale(1)'
                    }
                })
            )
        ),

        // Scroll hint
        !selectedDepartment && React.createElement('div', {
            key: 'scroll-hint',
            style: {
                textAlign: 'center',
                marginTop: '15px',
                color: '#666',
                fontSize: '0.9rem',
                opacity: '0.7',
                animation: 'fadeInUp 1s ease 0.5s both'
            }
        }, '← Scroll horizontally to explore departments →')
    ]);
}

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
        40%, 43% { transform: translate3d(0,-8px,0); }
        70% { transform: translate3d(0,-4px,0); }
        90% { transform: translate3d(0,-2px,0); }
    }
    
    @keyframes checkmark {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 0.7; transform: translateY(0); }
    }
    
    /* Enhanced image styles */
    #animated-department-selector img {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    #animated-department-selector .department-card:hover img {
        transform: scale(1.1) rotate(3deg);
        filter: brightness(1.2) drop-shadow(0 4px 12px rgba(0,0,0,0.4)) !important;
    }
    
    #animated-department-selector .selected-department img {
        transform: scale(1.1);
        filter: brightness(1.3) drop-shadow(0 6px 16px rgba(0,0,0,0.3)) !important;
    }
    
    /* Image loading states */
    #animated-department-selector img {
        opacity: 0;
        animation: imageLoad 0.5s ease forwards;
    }
    
    @keyframes imageLoad {
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Mount the component
function mountAnimatedDepartmentSelector() {
    const container = document.getElementById('animated-department-selector');
    
    if (!container) {
        console.warn('AnimatedDepartmentSelector: Container not found');
        return;
    }
    
    if (window.ReactDOM) {
        ReactDOM.render(React.createElement(AnimatedDepartmentSelector), container);
        console.log('AnimatedDepartmentSelector: Mounted successfully');
    } else {
        console.warn('AnimatedDepartmentSelector: ReactDOM not available');
        createFallbackSelector(container);
    }
}

// Fallback selector without animations
function createFallbackSelector(container) {
    container.innerHTML = `
        <div style="text-align: center; margin: 20px 0;">
            <h4>Choose Your Department</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; max-width: 800px; margin: 20px auto;">
                ${departments.map(dept => `
                    <div onclick="selectDepartment('${dept.id}', '${dept.name}')" 
                         style="background: ${dept.gradient}; color: white; padding: 20px; border-radius: 10px; cursor: pointer; text-align: center; transition: transform 0.2s; border: 3px solid transparent;"
                         onmouseover="this.style.transform='scale(1.02)'"
                         onmouseout="this.style.transform='scale(1)'">
                        <img src="${dept.icon}" alt="${dept.name}" style="width: 50px; height: 50px; object-fit: contain; margin-bottom: 10px; filter: brightness(1.1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="font-size: 2rem; margin-bottom: 10px; display: none;">📁</div>
                        <h3 style="margin: 0 0 5px 0;">${dept.name}</h3>
                        <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">${dept.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add global function to select department
    window.selectDepartment = function(id, name) {
        const hiddenInput = document.getElementById('department-hidden');
        if (hiddenInput) {
            hiddenInput.value = id;
            const event = new Event('change', { bubbles: true });
            hiddenInput.dispatchEvent(event);
        }
        
        // Visual feedback
        const cards = container.querySelectorAll('div[onclick]');
        cards.forEach(card => {
            card.style.border = card.getAttribute('onclick').includes(id) ? '3px solid white' : '3px solid transparent';
        });
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAnimatedDepartmentSelector);
} else {
    setTimeout(mountAnimatedDepartmentSelector, 100); // Small delay to ensure React is loaded
}
