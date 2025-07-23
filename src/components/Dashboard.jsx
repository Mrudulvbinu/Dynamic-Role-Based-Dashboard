import React, { useMemo, useState, useEffect, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useRolePermissions from "../hooks/useRolePermissions";
import {
  Box,
  Card,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import {
  ExitToApp,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Settings,
  Widgets,
} from "@mui/icons-material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DownloadIcon from "@mui/icons-material/Download";
import StatusCard from "./widgets/StatusCard";
import ChartWidget from "./widgets/ChartWidget";
import ActivityTable from "./widgets/ActivityTable";
import LabResultsPie from "./widgets/LabResultsPie";
import LabTrendsBar from "./widgets/LabTrendsBar";
import PatientStatsCard from "./widgets/PatientStatsCard";
import UpcomingAppointments from "./widgets/UpcomingAppointments";
import Prescriptions from "./widgets/Prescriptions";
import TableChartIcon from "@mui/icons-material/TableChart";
import DynamicTable from "./DynamicTable";
import { patientTableData, doctorTableData } from "../mockData";
import FormBuilder from "./formbuilder/FormBuilder";
import SavedForms from "./formbuilder/SavedForms";
import UseForms from "./formbuilder/UseForms";

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_WIDTH = 3.7;
const WIDGET_HEIGHT = 2.2;
const GRID_COLUMNS = 12;
const ROW_HEIGHT = 80;
const CONTAINER_PADDING = [20, 20];
const GRID_MARGIN = [20, 20];

const Dashboard = ({ role = "user", onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const rawWidgets = useRolePermissions(role);
  const allWidgets = useMemo(() => rawWidgets || [], [rawWidgets]);
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [widgetMenuAnchor, setWidgetMenuAnchor] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!allWidgets?.length || initialized.current) return;

    const initializeDashboard = () => {
      try {
        const savedWidgets = localStorage.getItem(`selectedWidgets-${role}`);
        const savedLayouts = localStorage.getItem(`dashboardLayout-${role}`);

        const initialWidgets = savedWidgets
          ? JSON.parse(savedWidgets) || []
          : allWidgets.map((w) => w?.id).filter(Boolean);

        const calculateInitialLayout = (widgets = []) => {
          return widgets.map((widget, index) => ({
            i: widget?.id?.toString() || `widget-${index}`,
            x: (index % 3) * WIDGET_WIDTH,
            y: Math.floor(index / 3) * WIDGET_HEIGHT,
            w: WIDGET_WIDTH,
            h: WIDGET_HEIGHT,
            minW: WIDGET_WIDTH,
            maxW: WIDGET_WIDTH,
            minH: WIDGET_HEIGHT,
            maxH: WIDGET_HEIGHT,
            isResizable: false,
          }));
        };

        const initialLayouts = savedLayouts
          ? JSON.parse(savedLayouts) || { lg: [] }
          : {
              lg: calculateInitialLayout(
                allWidgets.filter((w) => initialWidgets.includes(w?.id))
              ),
            };

        setSelectedWidgets(initialWidgets);
        setLayouts(initialLayouts);
        initialized.current = true;
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        setSelectedWidgets(allWidgets.map((w) => w?.id).filter(Boolean));
        setLayouts({ lg: [] });
      }
    };

    initializeDashboard();
  }, [role, allWidgets]);

  const handleToggleWidget = (widgetId) => {
    if (!widgetId) return;

    const newSelection = selectedWidgets.includes(widgetId)
      ? selectedWidgets.filter((id) => id !== widgetId)
      : [...selectedWidgets, widgetId];

    setSelectedWidgets(newSelection);

    const visibleWidgets = allWidgets.filter(
      (w) => w?.id && newSelection.includes(w.id)
    );
    const newLayout = visibleWidgets.map((widget, index) => {
      const existingPos = layouts?.lg?.find(
        (l) => l.i === widget?.id?.toString()
      );
      if (existingPos) return existingPos;

      const maxY = layouts?.lg?.reduce(
        (max, item) => Math.max(max, item?.y || 0),
        -1
      );
      return {
        i: widget?.id?.toString() || `widget-${index}`,
        x: (index % 3) * WIDGET_WIDTH,
        y: maxY + WIDGET_HEIGHT,
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT,
        isResizable: false,
      };
    });

    setLayouts({ lg: newLayout });
    try {
      localStorage.setItem(
        `selectedWidgets-${role}`,
        JSON.stringify(newSelection)
      );
      localStorage.setItem(
        `dashboardLayout-${role}`,
        JSON.stringify({ lg: newLayout })
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    const lgLayout = (allLayouts?.lg || []).map((item) => {
      const snappedX = Math.round((item?.x || 0) / WIDGET_WIDTH) * WIDGET_WIDTH;
      const boundedX = Math.min(
        Math.max(snappedX, 0),
        GRID_COLUMNS - WIDGET_WIDTH
      );

      return {
        ...item,
        x: boundedX,
        y: item?.y || 0,
        w: WIDGET_WIDTH,
        h: WIDGET_HEIGHT,
      };
    });

    setLayouts({ lg: lgLayout });
    try {
      localStorage.setItem(
        `dashboardLayout-${role}`,
        JSON.stringify({ lg: lgLayout })
      );
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleDragStop = (layout, oldItem, newItem) => {
    if (!newItem?.i) return;

    const targetWidget = layout.find(
      (item) =>
        item?.i &&
        item.i !== newItem.i &&
        item.x === newItem.x &&
        item.y === newItem.y
    );

    if (targetWidget) {
      const updatedLayout = layout.map((item) => {
        if (item.i === newItem.i) {
          return { ...item, x: targetWidget.x, y: targetWidget.y };
        }
        if (item.i === targetWidget.i) {
          return { ...item, x: newItem.x, y: newItem.y };
        }
        return item;
      });

      setLayouts({ lg: updatedLayout });
      try {
        localStorage.setItem(
          `dashboardLayout-${role}`,
          JSON.stringify({ lg: updatedLayout })
        );
      } catch (error) {
        console.error("Error saving layout:", error);
      }
    }
  };

  const handleDrawerToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleWidgetMenuOpen = (event) => {
    setWidgetMenuAnchor(event?.currentTarget);
  };

  const handleWidgetMenuClose = () => {
    setWidgetMenuAnchor(null);
  };

  const visibleWidgets = allWidgets.filter(
    (w) => w?.id && selectedWidgets.includes(w.id)
  );

  const drawerWidth = 230;
  const collapsedDrawerWidth = 60;

  const renderWidgetContent = (widget) => {
    if (!widget) return null;

    switch (widget.type) {
      case "status":
        return <StatusCard {...(widget.config || {})} compact />;
      case "chart":
        return <ChartWidget compact />;
      case "activity":
        return <ActivityTable compact />;
      case "labPie":
        return <LabResultsPie compact />;
      case "labBar":
        return <LabTrendsBar compact />;
      case "appointmentList":
        return (
          <UpcomingAppointments
            compact
            appointments={widget.config?.appointments || []}
          />
        );
      case "prescriptionList":
        return (
          <Prescriptions
            compact
            prescriptions={widget.config?.prescriptions || []}
          />
        );
      case "patientStatus":
        return <PatientStatsCard {...(widget.config || {})} compact />;
      default:
        return (
          <Card sx={{ p: 2, height: "100%" }}>
            {" "}
            {/* Reduced padding from p:4 */}
            <Typography variant="body2">
              {widget.name || "Unnamed Widget"}
            </Typography>
          </Card>
        );
    }
  };

  const navItems = [
    {
      tab: "dashboard",
      icon: <DashboardIcon />,
      label: "Dashboard",
      show: true,
    },
    {
      tab: "dataTable",
      icon: <TableChartIcon />,
      label: "Data Table",
      show: ["doctor", "patient"].includes(role),
    },
    {
      tab: "formPlus",
      icon: <NoteAddIcon />,
      label: "Form+",
      show: role === "admin",
    },
    {
      tab: "forms",
      icon: <ListAltIcon />,
      label: "Form Testing",
      show: role === "admin",
    },
    {
      tab: "UseForms",
      icon: <DownloadIcon />,
      label: "Forms",
      show: role === "admin",
    },
    {
      tab: "settings",
      icon: <Settings />,
      label: "Settings",
      show: true,
    },
  ];

  const drawer = (
    <List sx={{ height: "100%", pt: 0, px: sidebarOpen ? 1 : 0 }}>
      {navItems
        .filter((item) => item.show)
        .map(({ tab, icon, label }) => (
          <Tooltip
            key={tab}
            title={!sidebarOpen ? label : ""}
            placement="right"
          >
            <ListItem
              button
              onClick={() => setActiveTab(tab)}
              selected={activeTab === tab}
              sx={{
                my: 0.5,
                px: sidebarOpen ? 2 : 1,
                py: 1,
                borderRadius: 2,
                backgroundColor: activeTab === tab ? "#097969" : "transparent",
                color: activeTab === tab ? "white" : "black",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                  color: "black",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === tab ? "white" : "black",
                  minWidth: sidebarOpen ? 40 : "unset",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                  sx={{ ml: 1 }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#097969",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: { xs: "4rem", sm: "4rem" },
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            justifyContent: "space-between",
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
                p: { xs: "0.5rem", sm: "0.75rem" },
              }}
            >
                <MenuIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>

            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "bold",
                color: "#ffffff",
                fontSize: {
                  xs: "1rem",
                  sm: "1.25rem",
                  md: "1.5rem",
                },
                lineHeight: 1.2,
              }}
            >
              {`${
                role?.charAt(0)?.toUpperCase() + role?.slice(1) || "User"
              } Dashboard`}
            </Typography>
          </Box>

          {/* Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                <Widgets sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              }
              onClick={handleWidgetMenuOpen}
              sx={{
                borderRadius: "1rem",
                textTransform: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                borderWidth: "2px",
                borderColor: "white",
                color: "white",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 0.5, sm: 1.5 }, // Reduced padding on small screens
                py: { xs: 0.5, sm: 0.75 },
                minWidth: 0, // Allows button to shrink
                "& .MuiButton-startIcon": {
                  mr: { xs: 0, sm: 0.5 }, // No margin on small screens
                },
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Widgets
              </Box>
            </Button>

            <Menu
              anchorEl={widgetMenuAnchor}
              open={Boolean(widgetMenuAnchor)}
              onClose={handleWidgetMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: "70vh",
                  width: { xs: "90vw", sm: "16rem" },
                  mt: 0.5,
                },
              }}
              MenuListProps={{
                sx: { py: 0 },
              }}
            >
              <MenuItem disabled>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Select Widgets
                </Typography>
              </MenuItem>
              {allWidgets.map((widget) => (
                <MenuItem
                  key={widget?.id || Math.random().toString()}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ py: 0.5 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedWidgets.includes(widget?.id)}
                        onChange={() => handleToggleWidget(widget?.id)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8125rem" }}
                      >
                        {widget?.name || "Unnamed Widget"}
                      </Typography>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </MenuItem>
              ))}
            </Menu>

            <Button
              variant="outlined"
              color="inherit"
              startIcon={
                <ExitToApp sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              }
              onClick={onLogout}
              sx={{
                borderRadius: "1rem",
                textTransform: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                borderWidth: "2px",
                borderColor: "white",
                color: "white",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 0.5, sm: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: 0,
                "& .MuiButton-startIcon": {
                  mr: { xs: 0, sm: 0.5 },
                },
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", position: "relative" }}>
        {/* Sidebar - Overlay version */}
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
              transition: "width 0.3s ease",
              overflowX: "hidden",
              top: "64px",
              height: "calc(100vh - 64px)",
              backgroundColor: "#f0fff0",
              borderRight: "1px solid #dcdcdc",
              boxShadow: 3,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Overlay when sidebar is open*/}
        <Box
          sx={{
            position: "fixed",
            top: "64px",
            left: sidebarOpen ? drawerWidth : 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(64, 64, 64, 0.2)",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            pointerEvents: sidebarOpen ? "auto" : "none",
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onClick={handleDrawerToggle}
        />

        {/* Main Content  */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            transition: "all 0.3s ease",
            paddingTop: "80px",
            paddingBottom: "40px",
            backgroundColor: "#fffef7ff",
          }}
        >
          {activeTab === "dashboard" ? (
            <div
              className="p-4"
              style={{
                paddingTop: "10px",
                paddingBottom: "30px",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                onLayoutChange={handleLayoutChange}
                onDragStop={handleDragStop}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={ROW_HEIGHT}
                isDraggable={true}
                isResizable={false}
                margin={GRID_MARGIN}
                containerPadding={CONTAINER_PADDING}
                draggableCancel=".MuiButton-root, .MuiIconButton-root"
                compactType="vertical"
                preventCollision={false}
                style={{
                  minHeight: "calc(100vh - 200px)",
                  backgroundColor: "transparent",
                }}
              >
                {visibleWidgets.map((widget, index) => {
                  const defaultLayout = {
                    x: (index % 3) * WIDGET_WIDTH,
                    y: Math.floor(index / 3) * WIDGET_HEIGHT,
                    w: WIDGET_WIDTH,
                    h: WIDGET_HEIGHT,
                    minH: WIDGET_HEIGHT,
                    maxH: WIDGET_HEIGHT,
                  };

                  const existingLayout = layouts?.lg?.find(
                    (l) => l.i === widget?.id?.toString()
                  );

                  return (
                    <div
                      key={widget?.id || `widget-${index}`}
                      data-grid={existingLayout || defaultLayout}
                      style={{
                        overflow: "hidden",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      {renderWidgetContent(widget)}
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            </div>
          ) : activeTab === "settings" ? (
            <Box
              sx={{ pr: { xs: 2, sm: 4, md: 7 }, pl: { xs: 2, sm: 4, md: 7 } }}
            >
              <Card
                sx={{
                  p: { xs: 1.5, sm: 2.5, md: 3 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant={window.innerWidth < 600 ? "h5" : "h4"}
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  Settings
                </Typography>
                <Typography
                  sx={{
                    p: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textAlign: "center",
                    mb: { xs: 1, sm: 2 },
                  }}
                  variant={window.innerWidth < 600 ? "body1" : "h6"}
                >
                  Application settings will appear here
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  <img
                    src={require("../assets/setting.png")}
                    alt="Settings Logo"
                    style={{
                      height: window.innerWidth < 600 ? "120px" : "160px",
                      width: "auto",
                    }}
                  />
                </Box>
              </Card>
            </Box>
          ) : activeTab === "formPlus" ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                {localStorage.getItem("formToEdit")
                  ? "Form Builder"
                  : "Form Builder"}
              </Typography>
              <FormBuilder
                key={localStorage.getItem("formToEdit") || "create"}
                editMode={!!localStorage.getItem("formToEdit")}
                formId={localStorage.getItem("formToEdit")}
                setActiveTab={setActiveTab}
                onCancelEdit={() => {
                  localStorage.removeItem("formToEdit");
                  setActiveTab("forms");
                }}
              />
            </Box>
          ) : activeTab === "forms" ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Test Forms
              </Typography>
              {activeTab === "forms" && (
                <SavedForms setActiveTab={setActiveTab} />
              )}
            </Box>
          ) : activeTab === "UseForms" ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Available Forms
              </Typography>
              {activeTab === "UseForms" && (
                <UseForms setActiveTab={setActiveTab} />
              )}
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {role === "doctor" ? "Patient Records" : "Appointment History"}
              </Typography>
              <DynamicTable
                columns={
                  role === "doctor"
                    ? doctorTableData?.columns || []
                    : patientTableData?.columns || []
                }
                data={
                  role === "doctor"
                    ? doctorTableData?.data || []
                    : patientTableData?.data || []
                }
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
