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

const WIDGET_WIDTH = 4;
const WIDGET_HEIGHT = 3;
const GRID_COLUMNS = 12;
const ROW_HEIGHT = 120;
const CONTAINER_PADDING = [20, 30];
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

  const renderWidgetContent = (widget) => {
    if (!widget) return null;

    switch (widget.type) {
      case "status":
        return <StatusCard {...(widget.config || {})} />;
      case "chart":
        return <ChartWidget />;
      case "activity":
        return <ActivityTable />;
      case "labPie":
        return <LabResultsPie />;
      case "labBar":
        return <LabTrendsBar />;
      case "appointmentList":
        return (
          <UpcomingAppointments
            appointments={widget.config?.appointments || []}
          />
        );
      case "prescriptionList":
        return (
          <Prescriptions prescriptions={widget.config?.prescriptions || []} />
        );
      case "patientStatus":
        return <PatientStatsCard {...(widget.config || {})} />;
      default:
        return (
          <Card sx={{ p: 4, height: "100%" }}>
            <Typography>{widget.name || "Unnamed Widget"}</Typography>
          </Card>
        );
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgb(255, 255, 231)",
      }}
    >
      <List sx={{ pt: 0, flexGrow: 1 }}>
        {[
          { tab: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
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
        ].map(
          ({ tab, icon, label, show = true }) =>
            show && (
              <ListItem
                key={tab}
                button={true}
                selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  mt: tab === "dashboard" ? "64px" : 0,
                  backgroundColor:
                    activeTab === tab ? "#097969" : "transparent",
                  color: activeTab === tab ? "white" : "black",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    transform: "scale(1.01)",
                    "& .MuiListItemIcon-root": {
                      color: "black",
                    },
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeTab === tab ? "white" : "black",
                    minWidth: "40px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                />
              </ListItem>
            )
        )}
      </List>

      <List sx={{ pb: 2 }}>
        <ListItem
          button={true}
          selected={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          sx={{
            backgroundColor:
              activeTab === "settings" ? "#097969" : "transparent",
            color: activeTab === "settings" ? "white" : "black",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "white",
              color: "black",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              transform: "scale(1.01)",
              "& .MuiListItemIcon-root": {
                color: "black",
              },
            },
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon
            sx={{
              color: activeTab === "settings" ? "white" : "black",
              minWidth: "40px",
              transition: "color 0.3s ease",
            }}
          >
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontWeight: "bold",
              fontFamily: '"Poppins", sans-serif',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#097969",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "70px",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ height: "64px", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 3 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {(role?.charAt(0)?.toUpperCase() + role?.slice(1) || "User") +
                " Dashboard"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Widgets />}
              onClick={handleWidgetMenuOpen}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                borderWidth: "2px",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                  borderWidth: "2px",
                  borderColor: "white",
                },
              }}
            >
              Widgets
            </Button>
            <Menu
              anchorEl={widgetMenuAnchor}
              open={Boolean(widgetMenuAnchor)}
              onClose={handleWidgetMenuClose}
              PaperProps={{
                style: {
                  maxHeight: "70vh",
                  width: "250px",
                },
              }}
            >
              <MenuItem disabled>
                <Typography variant="subtitle1" fontWeight="bold">
                  Select Widgets
                </Typography>
              </MenuItem>
              {allWidgets.map((widget) => (
                <MenuItem
                  key={widget?.id || Math.random().toString()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedWidgets.includes(widget?.id)}
                        onChange={() => handleToggleWidget(widget?.id)}
                        color="primary"
                      />
                    }
                    label={widget?.name || "Unnamed Widget"}
                    sx={{ width: "100%" }}
                  />
                </MenuItem>
              ))}
            </Menu>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={onLogout}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                borderWidth: "2px",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                  borderWidth: "2px",
                  borderColor: "white",
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

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <Box
            component="nav"
            sx={{
              width: drawerWidth,
              flexShrink: 15,
              transition: "all 0.5s ease",
            }}
          >
            <Drawer
              variant="persistent"
              anchor="left"
              open={sidebarOpen}
              PaperProps={{
                sx: {
                  width: drawerWidth,
                  top: "60px",
                  height: "calc(100vh - 60px)",
                  overflow: "hidden",
                  borderRight: "none",
                  background: "transparent",
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 2,
            marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
            width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            transition: "all 0.3s ease",
            paddingTop: "80px",
            paddingBottom: "40px",
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
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
            <Box sx={{ pr: 7, pl: 7 }}>
              <Card sx={{ p: 4, height: "100%" }}>
                <Typography variant="h4" gutterBottom>
                  Settings
                </Typography>
                <Typography sx={{ p: 3 }} variant="h5">
                  Application settings will appear here
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={require("../assets/setting.png")}
                    alt="Settings Logo"
                    style={{
                      height: "200px",
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
