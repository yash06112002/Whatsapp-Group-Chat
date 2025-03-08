import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Message, SmartToy, Image, PersonAdd, Lock } from '@mui/icons-material';
import './InfoModal.css';

const features = [
  {
    title: 'Guest Mode',
    description: 'Access without login. Limited to 3 manual messages and 3 AI bot interactions.',
    icon: <PersonAdd />,
  },
  {
    title: 'Real-time Chat',
    description: 'Send and receive messages instantly in chat rooms.',
    icon: <Message />,
  },
  {
    title: 'AI Bot Integration',
    description: 'Get AI-powered responses using the bot button in chats.',
    icon: <SmartToy />,
  },
  {
    title: 'Image Sharing',
    description: 'Share images in conversations using the attachment button.',
    icon: <Image />,
  },
  {
    title: 'Secure Login',
    description: 'Sign in securely with your Google account for unlimited access.',
    icon: <Lock />,
  },
];

function InfoModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Features Guide
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} className="feature-item">
              <ListItemIcon className="feature-icon">
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={feature.title}
                secondary={feature.description}
                className="feature-text"
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default InfoModal;