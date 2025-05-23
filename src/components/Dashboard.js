import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useRolePermissions from "../hooks/useRolePermissions";
import { Box, Card, Typography, Button, AppBar, Toolbar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from "@mui/material";
import { ExitToApp, Dashboard as DashboardIcon, Menu, Settings } from "@mui/icons-material";
import StatusCard from "./widgets/StatusCard";
import ChartWidget from "./widgets/ChartWidget";
import ActivityTable from "./widgets/ActivityTable";
import LabResultsPie from "./widgets/LabResultsPie";
import LabTrendsBar from "./widgets/LabTrendsBar";
import WidgetSelector from "./WidgetSelector";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ role, onLogout }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const allWidgets = useRolePermissions(role);
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });

  useEffect(() => {
    const savedWidgets = localStorage.getItem(`selectedWidgets-${role}`);
    const savedLayouts = localStorage.getItem(`dashboardLayout-${role}`);
    
    const initialWidgets = savedWidgets 
      ? JSON.parse(savedWidgets) 
      : allWidgets.map(w => w.id);
      
    const initialLayouts = savedLayouts 
      ? JSON.parse(savedLayouts)
      : {
          lg: allWidgets.map((widget, index) => ({
            i: widget.id.toString(),
            x: (index % 2) * 2, // Adjusted to account for sidebar space
            y: Math.floor(index / 2) * 2,
            w: 4,
            h: 2,
            minW: 2,
            minH: 2,
            isResizable: true,
            isDraggable: true
          }))
        };

    setSelectedWidgets(initialWidgets);
    setLayouts(initialLayouts);
  }, [role, allWidgets]);

  const handleToggleWidget = (widgetId) => {
    const newSelection = selectedWidgets.includes(widgetId)
      ? selectedWidgets.filter(id => id !== widgetId)
      : [...selectedWidgets, widgetId];
    setSelectedWidgets(newSelection);
    localStorage.setItem(`selectedWidgets-${role}`, JSON.stringify(newSelection));
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    // Prevent widgets from going into sidebar space
    const adjustedLayouts = {};
    Object.keys(allLayouts).forEach((breakpoint) => {
      adjustedLayouts[breakpoint] = allLayouts[breakpoint].map(item => {
        // On desktop (lg), ensure x position doesn't go into sidebar space
        if (breakpoint === 'lg' && item.x < 2) {
          return { ...item, x: 2 };
        }
        return item;
      });
    });
    
    setLayouts(adjustedLayouts);
    localStorage.setItem(`dashboardLayout-${role}`, JSON.stringify(adjustedLayouts));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const visibleWidgets = allWidgets.filter(w => selectedWidgets.includes(w.id));

  const drawerWidth = 220;

  const drawer = (
    <Box
      sx={{
        height: '100%',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        boxShadow: '0 8px 32px rgba(14, 17, 71, 0.37)',
        borderRight: '4px solid rgba(255, 255, 255, 0.78)',
        background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.89) 100%)',
      }}
    >
      <List sx={{ pt: 0 }}>
        <ListItem 
          button 
          selected={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
          sx={{
            mt: '64px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              borderLeft: '3px solid gray'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.01)',
              boxShadow: '0 2px 4px rgba(91, 85, 85, 0.3)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'black', minWidth: '40px' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{ 
              color: 'black',
              fontWeight: 'bold',
              fontFamily: '"Poppins", sans-serif'
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          selected={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              borderLeft: '3px solid gray'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.01)',
              boxShadow: '0 2px 4px rgba(91, 85, 85, 0.3)'
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: 'black', minWidth: '40px' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ 
              color: 'black',
              fontWeight: 'bold',
              fontFamily: '"Poppins", sans-serif'
            }} 
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#0059b3',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '66px',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ height: '64px', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 3 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h4" sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="inherit" 
            startIcon={<ExitToApp />}
            onClick={onLogout}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              borderWidth: '2px',
              borderColor: 'white',
              color: 'white', 
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.05)',
                borderWidth: '2px',
                borderColor: 'white', 
                boxShadow: '0 4px 8px rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }}}>
              Logout
            </Box>
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '65px' }}>
        {/* Desktop Sidebar - Permanent and takes its own space */}
        {!isMobile && (
          <Box
            sx={{
              width: drawerWidth,
              flexShrink: 80,
            }}
          >
            <Drawer
              variant="permanent"
              open
              sx={{
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  top: '64px',
                  height: 'calc(100vh - 64px)',
                  overflow: 'hidden',
                  borderRight: 'none',
                  background: 'transparent',
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        )}

        {/* Mobile Sidebar - Temporary and overlays content */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                top: '64px',
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                borderRight: 'none',
                background: 'transparent',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Main Content - Adjusts width based on sidebar */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 1,
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            ml: isMobile ? 0 : `${drawerWidth}px`,
            transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          }}
        >
          {activeTab === 'dashboard' ? (
            <>
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                onLayoutChange={handleLayoutChange}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                isDraggable={true}
                isResizable={true}
                margin={[20, 20]}
                containerPadding={[0, 20]}
              >
                {visibleWidgets.map((widget) => (
                  <div 
                    key={widget.id}
                    data-grid={{
                      ...layouts.lg.find(l => l.i === widget.id.toString()) || { 
                        x: isMobile ? 0 : 3, // Start widgets after sidebar space on desktop
                        y: 0, 
                        w: 4, 
                        h: 3,
                        minW: 2,
                        minH: 2
                      }
                    }}
                  >
                    {widget.type === "status" ? (
                      <StatusCard {...widget.config} />
                    ) : widget.type === "chart" ? (
                      <ChartWidget />
                    ) : widget.type === "activity" ? (
                      <ActivityTable />
                    ) : widget.type === "labPie" ? (
                      <LabResultsPie />
                    ) : widget.type === "labBar" ? (
                      <LabTrendsBar />
                    ) : (
                      <Card sx={{ p: 2, height: '100%' }}>
                        <Typography>{widget.name}</Typography>
                      </Card>
                    )}
                  </div>
                ))}
              </ResponsiveGridLayout>

              <WidgetSelector
                widgets={allWidgets}
                selectedWidgets={selectedWidgets}
                onToggleWidget={handleToggleWidget}
              />
            </>
          ) : (
            <Card sx={{ p: 4, height: '86%' }}>
              <Typography variant="h4" gutterBottom>
                Settings
              </Typography>
              <Typography>
                Application settings will appear here
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;