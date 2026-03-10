// script.js - Complete JavaScript for CTO Bird Watch website

// ==================== FORM VALIDATION FUNCTIONS ====================

// Registration Form Validation
function validateRegisterForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';
    
    // Username validation
    if (username.length < 3) {
        document.getElementById('usernameError').textContent = 'Username must be at least 3 characters';
        isValid = false;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Password validation
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (isValid) {
        alert('Registration successful! (Demo - not connected to server)');
        // In real implementation, this would submit to server
        // For now, just redirect to login
        window.location.href = 'login.html';
    }
    
    return false;
}

// Login Form Validation
function validateLoginForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (username && password) {
        alert('Login successful! (Demo - using hardcoded validation)');
        // Demo - set logged in user in session storage
        sessionStorage.setItem('currentUser', username);
        window.location.href = 'posts.html';
    } else {
        alert('Please enter both username and password');
    }
    
    return false;
}

// Post Form Validation
function validatePostForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('postUsername').value;
    const location = document.getElementById('location').value;
    const obsDate = document.getElementById('obsDate').value;
    const obsTime = document.getElementById('obsTime').value;
    const birdSpecies = document.getElementById('birdSpecies').value;
    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const imageFile = document.getElementById('image').files[0];
    
    // Basic validation
    if (!username || !location || !obsDate || !obsTime || !birdSpecies || !activity || !duration) {
        alert('Please fill in all required fields');
        return false;
    }
    
    // Image validation if file is uploaded
    if (imageFile) {
        // Check file size (max 1.2MB = 1.2 * 1024 * 1024 bytes)
        const maxSize = 1.2 * 1024 * 1024; // 1.2MB in bytes
        if (imageFile.size > maxSize) {
            document.getElementById('fileError').textContent = 'Image must be less than 1.2MB';
            return false;
        }
        
        // Check file type
        const fileType = imageFile.type;
        if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
            document.getElementById('fileError').textContent = 'Only JPG and PNG files are allowed';
            return false;
        }
    }
    
    alert('Post submitted successfully! (Demo - not saved to database yet)');
    // In real implementation, this would submit to server
    // For now, just redirect to posts page
    window.location.href = 'posts.html';
    
    return false;
}

// ==================== POSTS PAGE FUNCTIONALITY ====================

// Sample posts data (for demonstration)
const samplePosts = [
    {
        id: 1,
        username: 'BirdWatcher23',
        location: 'Erenan',
        date: '2026-04-03',
        time: '14:30',
        bird: 'Robin',
        activity: 'Feeding',
        duration: 5,
        comments: 'Spotted in garden feeder, very active',
        image: null
    },
    {
        id: 2,
        username: 'NatureLover',
        location: 'Bylyn',
        date: '2026-04-03',
        time: '09:15',
        bird: 'Wood Pigeon',
        activity: 'Visit',
        duration: 2,
        comments: 'On rooftop, cooing loudly',
        image: null
    },
    {
        id: 3,
        username: 'OwlSpotter',
        location: 'Holmer',
        date: '2026-04-02',
        time: '18:45',
        bird: 'Unknown',
        activity: 'Other',
        duration: 10,
        comments: 'Heard call in the woods, couldn\'t see clearly',
        image: null
    },
    {
        id: 4,
        username: 'BirdWatcher23',
        location: 'Marend',
        date: '2026-04-01',
        time: '11:20',
        bird: 'Blue Tit',
        activity: 'Nesting',
        duration: 15,
        comments: 'Building nest in bird box',
        image: null
    },
    {
        id: 5,
        username: 'UrbanBirder',
        location: 'Zord',
        date: '2026-03-31',
        time: '16:00',
        bird: 'Starling',
        activity: 'Visit',
        duration: 8,
        comments: 'Large flock on power lines',
        image: null
    }
];

// Load posts when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the posts page
    if (document.getElementById('postsContainer')) {
        displayPosts(samplePosts);
    }
    
    // Set up character counter on new post page
    const commentsField = document.getElementById('comments');
    if (commentsField) {
        commentsField.addEventListener('input', updateCharCount);
    }
    
    // Set default date on new post page to today
    const dateField = document.getElementById('obsDate');
    if (dateField) {
        const today = new Date().toISOString().split('T')[0];
        dateField.value = today;
    }
    
    // Check if user is logged in (for demo)
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        // Update UI to show logged in state
        updateNavForLoggedInUser(currentUser);
    }
});

// Display posts in the posts container
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const currentUser = sessionStorage.getItem('currentUser') || 'BirdWatcher23'; // Default for demo
    
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No posts found matching your search.</div>';
        return;
    }
    
    let html = '';
    
    posts.forEach(post => {
        // Determine if current user is the author (for edit/delete buttons)
        const isAuthor = post.username === currentUser;
        
        html += `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <span class="post-author">@${post.username}</span>
                    <span class="post-date">${formatDate(post.date)} at ${post.time}</span>
                </div>
                
                <div class="post-details">
                    <div class="detail-item">
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${post.location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bird Species</span>
                        <span class="detail-value">${post.bird}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Activity</span>
                        <span class="detail-value">${post.activity}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${post.duration} minutes</span>
                    </div>
                </div>
                
                <div class="post-comments">
                    "${post.comments}"
                </div>
        `;
        
        // Add image if exists (placeholder for demo)
        if (post.image) {
            html += `
                <div class="post-image">
                    <img src="${post.image}" alt="Bird sighting">
                </div>
            `;
        }
        
        // Add action buttons if user is author
        if (isAuthor) {
            html += `
                <div class="post-actions">
                    <button class="edit-btn" onclick="editPost(${post.id})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deletePost(${post.id})">🗑️ Delete</button>
                </div>
            `;
        }
        
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

// Search posts function
function searchPosts() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayPosts(samplePosts);
        return;
    }
    
    const filteredPosts = samplePosts.filter(post => {
        return (
            post.comments.toLowerCase().includes(searchTerm) ||
            post.bird.toLowerCase().includes(searchTerm) ||
            post.location.toLowerCase().includes(searchTerm) ||
            post.username.toLowerCase().includes(searchTerm)
        );
    });
    
    displayPosts(filteredPosts);
}

// Edit post function (demo)
function editPost(postId) {
    alert(`Edit post ${postId} - This would open an edit form in the full implementation`);
    // In real implementation, this would redirect to edit page or open modal
}

// Delete post function (demo)
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        alert(`Post ${postId} deleted (Demo - no actual deletion)`);
        // In real implementation, this would remove from database
        // For demo, we'll filter it out from display
        const index = samplePosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            samplePosts.splice(index, 1);
            displayPosts(samplePosts);
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Update character counter for comments
function updateCharCount() {
    const comments = document.getElementById('comments').value;
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = comments.length;
        
        // Change color if approaching limit
        if (comments.length > 450) {
            charCount.style.color = '#e74c3c';
        } else if (comments.length > 400) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#666';
        }
    }
}

// Update navigation for logged in user
function updateNavForLoggedInUser(username) {
    const nav = document.querySelector('nav ul');
    if (nav) {
        // Could add logout button or welcome message
        const welcomeItem = document.createElement('li');
        welcomeItem.innerHTML = `<span style="color: #ffd700;">Welcome, ${username}!</span>`;
        nav.appendChild(welcomeItem);
    }
}

// ==================== IMAGE PREVIEW FUNCTION (Optional Enhancement) ====================

// Add image preview functionality
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'image') {
        const file = e.target.files[0];
        if (file) {
            // Clear previous error
            document.getElementById('fileError').textContent = '';
            
            // Validate file
            const maxSize = 1.2 * 1024 * 1024;
            if (file.size > maxSize) {
                document.getElementById('fileError').textContent = 'Image must be less than 1.2MB';
                e.target.value = ''; // Clear the file input
                return;
            }
            
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                document.getElementById('fileError').textContent = 'Only JPG and PNG files are allowed';
                e.target.value = ''; // Clear the file input
                return;
            }
            
            // Create preview (optional)
            const reader = new FileReader();
            reader.onload = function(e) {
                // You could display a preview here if you want
                console.log('Image ready for preview');
            };
            reader.readAsDataURL(file);
        }
    }
});

// ==================== LOGOUT FUNCTION (Optional) ====================

function logout() {
    sessionStorage.removeItem('currentUser');
    alert('You have been logged out');
    window.location.href = 'index.html';
}

// ==================== PROTECTED PAGES CHECK ====================

// Simple check for pages that require login (for demo)
function requireLogin() {
    const currentUser = sessionStorage.getItem('currentUser');
    const protectedPages = ['new-post.html', 'posts.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        // For demo purposes, we'll just set a default user
        sessionStorage.setItem('currentUser', 'BirdWatcher23');
    }
}

// Run on every page
requireLogin();