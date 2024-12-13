import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import SideNav from './side_nav';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { rentmobileDb, rentmobileStorage } from '../components/firebase.config';

// Styled Components for Layout
const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const AppBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #188423;
  color: white;
  font-size: 22px;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
`;

const MainContent = styled.div`
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '230px' : '70px')};
  padding-left: 40px;
  background-color: #f4f4f4;
  padding: 2rem;
  width: 100%;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
`;

const ToggleButton = styled.div`
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'none' : 'block')};
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  z-index: 200;
`;

// Styled Components for Form
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  resize: vertical;
  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #188423;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #0e6a19;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

// AnnouncementPage Component
const AnnouncementPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [targetAudience, setTargetAudience] = useState('');
  const [priority, setPriority] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedInUserData = JSON.parse(localStorage.getItem('userData'));
    if (loggedInUserData) {
      setLoggedInUser(loggedInUserData);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file && allowedTypes.includes(file.type)) {
      setImageFile(file);
    } else {
      alert('Only .jpg, .pdf, .png, and .jpeg files are allowed.');
      e.target.value = null;
    }
  };

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(''); // If no file is selected, return an empty string
        return;
      }

      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(rentmobileStorage, `announcements/${imageFile.name}`);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          setUploading(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            resolve(downloadURL); // Return the image URL
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedImageUrl = await uploadImage();

      await addDoc(collection(rentmobileDb, 'announcements'), {
        title,
        content,
        createdAt: Timestamp.now(),
        createdBy: loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : "admin12345",
        expirationDate: expirationDate ? Timestamp.fromDate(new Date(expirationDate)) : null,
        isActive: true,
        targetAudience: targetAudience.split(',').map((item) => item.trim()),
        imageUrl: uploadedImageUrl,
        priority,
      });

      alert('Announcement added successfully');
      // Reset form fields
      setTitle('');
      setContent('');
      setExpirationDate('');
      setImageFile(null);
      setTargetAudience('');
      setPriority('');
    } catch (error) {
      console.error('Error adding announcement: ', error);
    }
  };

  return (
    <LayoutContainer>
      <SideNav isSidebarOpen={isSidebarOpen} />
      <ToggleButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleButton>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <AppBar>
          <h1>Announcements</h1>
          <div>
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
        </AppBar>

        <h2>Add New Announcement</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextArea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Input
            type="date"
            placeholder="Expiration Date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <Input
            type="file"
            onChange={handleFileChange}
          />
          <Input
            type="text"
            placeholder="Target Audience (comma-separated)"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="" disabled>Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Announcement'}
          </Button>
        </Form>
      </MainContent>
    </LayoutContainer>
  );
};

export default AnnouncementPage;
