import React from 'react';
import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MailIcon from '@material-ui/icons/Mail';
import ListAltIcon from '@material-ui/icons/ListAlt';
import NotificationsIcon from '@material-ui/icons/Notifications';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { Link, useHistory } from 'react-router-dom';
import routes from '../../constants/routes.json';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
    },
    navbarStyle: {
      backgroundColor: '#323639',
    },
  })
);

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const history = useHistory();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    setAnchorEl(null);
    history.push('/profile');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem id="my-account" onClick={handleAccountClick}>
        My account
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        className={classes.navbarStyle}
      >
        <Toolbar>
          <Link to={routes.HOME}>
            <IconButton aria-label="go to home" color="inherit">
              <HomeIcon />
            </IconButton>
          </Link>
          <div className={classes.grow} />
          <div>
            <Link to={routes.KANBAN}>
              <IconButton aria-label="go to kanban" color="inherit">
                <ListAltIcon />
              </IconButton>
            </Link>
            <Link to={routes.VIDEO}>
              <IconButton aria-label="go to videos" color="inherit">
                <OndemandVideoIcon />
              </IconButton>
            </Link>
            <IconButton aria-label="go to calendar" color="inherit" disabled>
              <DateRangeIcon />
            </IconButton>
            <IconButton aria-label="show 4 new mails" color="inherit" disabled>
              <Badge badgeContent={0} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              disabled
            >
              <Badge badgeContent={0} color="secondary" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
}
