import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Tooltip from '@mui/material/Tooltip';
import { Share2 } from 'lucide-react';
import { Github } from 'lucide-react';
import { forwardRef, useState, useEffect } from 'react';

import { useSnackbar } from '../../context/SnackbarProvider';

/* helper functions */
function stringToColor(string = '') {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }

  return color;
}

function getAvatarProps(name, avatar) {
  if (avatar) return { src: avatar };

  if (!name) return { src: '/profile' };
  return {
    children: name?.charAt(0).toUpperCase() || '?',
    sx: {
      bgcolor: stringToColor(name),
      color: '#fff',
      fontWeight: 600,
    },
  };
}

const AvatarComponent = forwardRef(
  ({ tooltip, style = {}, onClick, src }, ref) => {
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [avatarProps, setAvatarProps] = useState({});

    const stored = JSON.parse(localStorage.getItem('userInfo'));
    useEffect(() => {

      if (src) {
        setAvatar(src);
        setUsername(stored?.user?.name || '');
        return;
      }

      if (!stored) {
        setAvatar('');
        setUsername('');
        return;
      }

      try {
        setAvatar(stored?.user?.avatar || '');
        setUsername(stored?.user?.name || '');
      } catch {
        setAvatar('');
        setUsername('');
      }
    }, [src, stored]);

    // const avatarProps = getAvatarProps(username, avatar);

    useEffect(() => {
      setAvatarProps(getAvatarProps(username, avatar));
    }, [username, avatar]);

    return (
      <Tooltip title={tooltip}>
        <IconButton onClick={onClick} ref={ref}>
          <Avatar
            {...avatarProps}
            sx={{
              ...avatarProps.sx,
              ...style,
            }}
          />
        </IconButton>
      </Tooltip>
    );
  }
);

const ShareButton = ({ style }) => {
  const { showSnackbar } = useSnackbar();

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      showSnackbar('Link copied!');
    }
  };

  return (
    <>
      <Tooltip title="Share">
        <IconButton onClick={handleShare} aria-label="share" sx={style}>
          <Share2 size={20} />
        </IconButton>
      </Tooltip>
    </>
  );
};

const GithubButton = ({ style }) => {
  const handleGithub = () => {
    const githubUrl = 'https://github.com/rayhan5497/Moviemon---watch-movies';
    window.open(githubUrl, '_blank');
  };

  return (
    <>
      <Tooltip title="View on GitHub">
        <IconButton onClick={handleGithub} aria-label="github" sx={style}>
          <Github size={20} />
        </IconButton>
      </Tooltip>
    </>
  );
};

const Toast = ({
  open,
  message,
  onClose,
  severity = 'info',
  autoHideDuration = 2500,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  sx,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', ...sx }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export { AvatarComponent, ShareButton, GithubButton, Toast };
