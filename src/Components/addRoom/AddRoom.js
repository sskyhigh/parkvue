import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Grid,
  CircularProgress,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
  Alert,
  Card,
  CardMedia,
  FormHelperText
} from "@mui/material";
import {
  Send,
  CloudUpload,
  LocationOn,
  Close,
  CheckCircle,
  Save,
  CarRental,
  Security,
  MonetizationOn,
  AutoAwesome,
  InfoOutlined,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "../map/Geocoder";
import { useValue, Context } from "../../context/ContextProvider";
import { db, doc, setDoc } from "../../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import uploadFileProgress from "../../firebase/uploadFileProgress";
import { 
  sanitizeText,
  sanitizeAddress,
  sanitizeZipCode,
  sanitizePrice,
  sanitizeTextarea
} from "../../utils/sanitize";
import { MAX_LISTING_CAPACITY } from "../../utils/capacity";
import { generateParkvueAIText, parseAIJSONObject } from "../../ai/parkvueAI";
import { getListingAIConfig } from "../../ai/listingAIConfig";

const AddRoom = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    state: { images, location },
    dispatch,
  } = useValue();

  const { currentUser } = useContext(Context);
  const [uploading, setUploading] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [video, setVideo] = useState(null); // Local state for video preview
  const [videoUrl, setVideoUrl] = useState(""); // Local state for video Firebase URL
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const [viewport, setViewport] = useState({
    longitude: location.lng || -74.006,
    latitude: location.lat || 40.7128,
    zoom: 12,
  });

  const [showAIAssist, setShowAIAssist] = useState(false);
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  const hideAIAssistTimerRef = useRef(null);

  // Form fields state
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    title: "",
    description: "",
    price: "",
    capacity: "1",
    isCommercial: false,
    vehicleTypes: [],
    amenities: [],
    size: "Standard",
    securityFeatures: [],
    accessHours: "24/7",
    availableFrom: "",
    availableTo: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        state: { redirectTo: routerLocation.pathname + routerLocation.search },
        replace: true,
      });
    }
  }, [currentUser, navigate, routerLocation.pathname, routerLocation.search]);

  const lastSourceRef = useRef(null); // 'form', 'map', 'api', 'geocoder'

  // Reverse Geocoding (Map -> Form)
  useEffect(() => {
    if (!location.lng || !location.lat) return;
    if (lastSourceRef.current === 'form' || lastSourceRef.current === 'api') return;

    const fetchAddress = async () => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}&types=address,poi`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features?.[0]) {
          const feature = data.features[0];
          let city = "", state = "", zip = "";
          feature.context?.forEach(c => {
            if (c.id.includes('place')) city = c.text;
            if (c.id.includes('region')) state = c.text;
            if (c.id.includes('postcode')) zip = c.text;
          });

          lastSourceRef.current = 'api';
          setFormData(prev => ({
            ...prev,
            address: feature.place_name.split(',')[0],
            city: city,
            state: state,
            zipCode: zip
          }));
        }
      } catch (e) { console.error("Reverse geocoding error:", e); }
    };

    // Debounce slightly to avoid rapid updates during drag
    const timer = setTimeout(fetchAddress, 800);
    return () => clearTimeout(timer);
  }, [location.lng, location.lat]);

  // Forward Geocoding (Form -> Map)
  useEffect(() => {
    // If update came from map/api, don't forward geocode back
    if (lastSourceRef.current === 'map' || lastSourceRef.current === 'api' || lastSourceRef.current === 'geocoder') return;

    const query = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
    if (query.replace(/,/g, '').trim().length < 8) return;

    const timer = setTimeout(async () => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features?.[0]) {
          const [lng, lat] = data.features[0].center;
          lastSourceRef.current = 'api';

          // Check if different enough to warrant update
          if (Math.abs(lng - location.lng) > 0.0001 || Math.abs(lat - location.lat) > 0.0001) {
            dispatch({
              type: "UPDATE_LOCATION",
              payload: { lng, lat }
            });
            setViewport(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 15 }));
          }
        }
      } catch (e) { console.error("Forward geocoding error:", e); }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData.address, formData.city, formData.state, formData.zipCode, dispatch, location.lng, location.lat]);

  // Available options
  const vehicleTypeOptions = [
    "Car", "SUV", "Truck", "Motorcycle", "Van", "Electric Vehicle", "Compact Car", "Sedan"
  ];

  const amenityOptions = [
    "Covered", "24/7 Access", "Security Camera", "Lighted", "Gated", "EV Charging",
    "Handicap Accessible", "Near Elevator", "Valet Available", "Monthly Discount"
  ];

  const securityFeatureOptions = [
    "Security Cameras", "Lighting", "Gated Entry", "Attendant On-site", "Alarm System", "Security Patrol"
  ];

  // Handle form field changes
  const handleChange = (field, value) => {
    lastSourceRef.current = 'form';
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showAIAssistNow = () => {
    if (hideAIAssistTimerRef.current) {
      clearTimeout(hideAIAssistTimerRef.current);
    }
    setShowAIAssist(true);
  };

  const scheduleHideAIAssist = () => {
    if (hideAIAssistTimerRef.current) {
      clearTimeout(hideAIAssistTimerRef.current);
    }
    hideAIAssistTimerRef.current = setTimeout(() => {
      setShowAIAssist(false);
    }, 150);
  };

  const handleGenerateTitleAndDescription = async () => {
    if (aiAssistLoading) return;

    const address = String(formData.address || "").trim();
    const city = String(formData.city || "").trim();
    const stateVal = String(formData.state || "").trim();
    const zipCode = String(formData.zipCode || "").trim();

    if (!address || !city || !stateVal || !zipCode) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Please complete the address, city, state, and ZIP code first.",
        },
      });
      return;
    }

    setAiAssistLoading(true);
    try {
      const listingConfig = getListingAIConfig();

      const prompt = `Generate a parking spot listing title and description for this location.

LOCATION DETAILS:
- Address: ${address}
- City: ${city}
- State: ${stateVal}
- ZIP Code: ${zipCode}

OUTPUT FORMAT (MUST FOLLOW EXACTLY):
Return ONLY a single JSON object with exactly these keys:
{"title":"...","description":"..."}

CONSTRAINTS:
- Do not include markdown or code fences.
- Do not include any other keys.
- Title should be appealing and specific to the area.
- Description should be one paragraph, no line breaks.
`;

      const text = await generateParkvueAIText({
        model: "gemini-2.5-flash",
        config: listingConfig,
        contents: prompt,
      });

      const parsed = parseAIJSONObject(text);
      const nextTitle = typeof parsed.title === "string" ? parsed.title.trim() : "";
      const nextDescription =
        typeof parsed.description === "string" ? parsed.description.trim() : "";

      if (!nextTitle || !nextDescription) {
        throw new Error("AI response missing title or description.");
      }

      handleChange("title", nextTitle);
      handleChange("description", nextDescription);

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "AI generated a title and description.",
        },
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message:
            "Failed to generate listing text. Please try again." +
            (error?.message ? ` (${error.message})` : ""),
        },
      });
    } finally {
      setAiAssistLoading(false);
    }
  };

  // Handle file upload
  const onDrop = useCallback((acceptedFiles) => {
    // Separate images and videos
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/'));

    // Validate Video
    if (videoFiles.length > 0) {
      if (video || videoFiles.length > 1) {
        dispatch({
          type: "UPDATE_ALERT",
          payload: { open: true, severity: "error", message: "Only 1 video allowed" },
        }); // Don't return here, enable processing valid images 
      } else {
        const file = videoFiles[0];
        if (file.size > 15 * 1024 * 1024) { // 15MB
          dispatch({
            type: "UPDATE_ALERT",
            payload: { open: true, severity: "error", message: "Video must be under 15MB" },
          });
        } else {
          const videoName = uuidv4() + "." + file.name.split(".").pop();
          const videoPreview = URL.createObjectURL(file);
          setVideo({ file, preview: videoPreview, name: videoName });

          // Upload Video to Firebase
          uploadFileProgress(
            file,
            `rooms/${currentUser?.uid || 'anonymous'}/videos`,
            videoName,
            (uploadProgress) => {
              setProgress(prev => ({
                ...prev,
                [videoName]: uploadProgress
              }));
            }
          ).then((finalUrl) => {
            setVideoUrl(finalUrl);
          }).catch((error) => {
            console.error("Video upload error:", error);
            dispatch({
              type: "UPDATE_ALERT",
              payload: { open: true, severity: "error", message: "Failed to upload video" },
            });
          });
        }
      }
    }

    // Validate Images
    if (imageFiles.length > 0) {
      if (images.length + imageFiles.length > 3) {
        dispatch({
          type: "UPDATE_ALERT",
          payload: {
            open: true,
            severity: "error",
            message: "Maximum 3 images allowed",
          },
        });
        // Proceed to add as many as possible? Or block? 
        // Current strict logic: return. 
        // I'll stick to strict but maybe allow partial? 
        // Just strict for now to match previous logic.
        return;
      }

      imageFiles.forEach((file) => {
        const imageName = uuidv4() + "." + file.name.split(".").pop();
        const imageURL = URL.createObjectURL(file);

        // Add to images array immediately for preview
        dispatch({ type: "UPDATE_IMAGES", payload: imageURL });

        // Upload to Firebase
        uploadFileProgress(
          file,
          `rooms/${currentUser?.uid || 'anonymous'}`,
          imageName,
          (uploadProgress) => {
            setProgress(prev => ({
              ...prev,
              [imageName]: uploadProgress
            }));
          }
        ).then((finalUrl) => {
          setImageUrls(prev => [...prev, finalUrl]);
        }).catch((error) => {
          console.error("Upload error:", error);
          dispatch({
            type: "UPDATE_ALERT",
            payload: {
              open: true,
              severity: "error",
              message: "Failed to upload image",
            },
          });
        });
      });
    }

  }, [images.length, currentUser, dispatch, video]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    // maxFiles removed to handle mixed types manually
  });

  // Remove image
  const removeImage = (index) => {
    dispatch({
      type: "DELETE_IMAGE",
      payload: index
    });
  };

  // Remove video
  const removeVideo = () => {
    setVideo(null);
    setVideoUrl("");
  };

  // Handle map viewport change
  const handleViewportChange = (newViewport) => {
    // Only consider it a map interaction if it's a drag/move
    // However, setViewport is also called by our geocoding effect.
    // If lastSource is 'api', we shouldn't overwrite it to 'map' here?
    // Actually handleViewportChange calls dispatch. 
    // If we are just panning, we want that to be 'map'.
    // If 'api' moved it (via setViewport), we might inadvertently trigger this?
    // But 'onMove' triggers this. Sync updates don't trigger 'onMove' usually unless props change?
    // Prop change updates internals but not 'onMove' event. 'onMove' is user interaction or transition.

    // We'll set it to map if it's not api/form (i.e. user pan)
    if (lastSourceRef.current !== 'api') {
      lastSourceRef.current = 'map';
    }

    setViewport(newViewport);
    dispatch({
      type: "UPDATE_LOCATION",
      payload: {
        lng: newViewport.longitude,
        lat: newViewport.latitude
      },
    });
  };

  // Handle location marker drag
  const handleMarkerDrag = (event) => {
    lastSourceRef.current = 'map';
    dispatch({
      type: "UPDATE_LOCATION",
      payload: {
        lng: event.lngLat.lng,
        lat: event.lngLat.lat
      },
    });
  };

  // Handle geolocation
  // pinpoints location
  const handleGeolocate = (event) => {
    lastSourceRef.current = 'map';
    dispatch({
      type: "UPDATE_LOCATION",
      payload: {
        lng: event.coords.longitude,
        lat: event.coords.latitude
      },
    });
    setViewport({
      ...viewport,
      longitude: event.coords.longitude,
      latitude: event.coords.latitude,
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      return "Please complete all address fields";
    }
    if (!formData.title || formData.title.length < 5) {
      return "Title must be at least 5 characters";
    }
    if (!formData.description || formData.description.length < 20) {
      return "Description must be at least 20 characters";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return "Please enter a valid price";
    }
    const cap = Number.parseInt(String(formData.capacity ?? "").trim(), 10);
    if (!Number.isFinite(cap) || cap < 1) {
      return "Please enter a valid number of spaces (capacity)";
    }
    if (cap > MAX_LISTING_CAPACITY) {
      return `Maximum capacity is ${MAX_LISTING_CAPACITY} spaces`;
    }
    if (formData.vehicleTypes.length === 0) {
      return "Please select at least one vehicle type";
    }
    if (images.length === 0) {
      return "Please upload at least one image";
    }
    // Check if images are still uploading
    if (imageUrls.length < images.length) {
      return `Please wait for all images to finish uploading (${imageUrls.length}/${images.length} complete)`;
    }
    // Check if video is still uploading
    if (video && !videoUrl) {
      return "Please wait for video to finish uploading";
    }
    if (!location.lng || !location.lat) {
      return "Please select a location on the map";
    }
    if (!formData.availableFrom) {
      return "Please select availability start date and time";
    }
    if (!formData.availableTo) {
      return "Please select availability end date and time";
    }
    const startDate = new Date(formData.availableFrom);
    const endDate = new Date(formData.availableTo);
    if (endDate <= startDate) {
      return "Availability end date must be after start date";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: validationError,
        },
      });
      return;
    }

    try {
      setUploading(true);

      const uniqueRoomId = uuidv4();
      
      // Sanitize all form inputs
      const sanitizedAddress = sanitizeAddress(formData.address);
      const sanitizedCity = sanitizeText(formData.city);
      const sanitizedState = sanitizeText(formData.state);
      const sanitizedZipCode = sanitizeZipCode(formData.zipCode);
      const sanitizedTitle = sanitizeText(formData.title);
      const sanitizedDescription = sanitizeTextarea(formData.description);
      const sanitizedPrice = sanitizePrice(formData.price);

      const parsedCapacity = Number.parseInt(String(formData.capacity ?? "").trim(), 10);
      const sanitizedCapacityRaw = Number.isFinite(parsedCapacity) && parsedCapacity > 0 ? parsedCapacity : 1;
      const sanitizedCapacity = Math.min(MAX_LISTING_CAPACITY, sanitizedCapacityRaw);
      
      const fullAddress = `${sanitizedAddress}, ${sanitizedCity}, ${sanitizedState} ${sanitizedZipCode}`;

      const room = {
        id: uniqueRoomId,
        capacity: sanitizedCapacity,
        maxCapacity: sanitizedCapacity,
        isCommercial: Boolean(formData.isCommercial),
        lng: location.lng,
        lat: location.lat,
        address: sanitizedAddress,
        city: sanitizedCity,
        state: sanitizedState,
        zipCode: sanitizedZipCode,
        fullAddress,
        price: sanitizedPrice,
        title: sanitizedTitle,
        description: sanitizedDescription,
        vehicleTypes: formData.vehicleTypes,
        amenities: formData.amenities,
        size: formData.size,
        securityFeatures: formData.securityFeatures,
        accessHours: formData.accessHours,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
        images: imageUrls,
        video: videoUrl || null,
        createdBy: currentUser?.uid,
        ownerName: currentUser?.fullName || "Anonymous",
        ownerEmail: currentUser?.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [],
        bookings: [],
      };

      await setDoc(doc(db, "rooms", uniqueRoomId), room);

      // Save form data to localStorage if checkbox is checked
      if (saveForFuture) {
        const savedData = {
          address: sanitizedAddress,
          city: sanitizedCity,
          state: sanitizedState,
          zipCode: sanitizedZipCode,
          capacity: String(sanitizedCapacity),
          isCommercial: Boolean(formData.isCommercial),
          vehicleTypes: formData.vehicleTypes,
          amenities: formData.amenities,
          size: formData.size,
          securityFeatures: formData.securityFeatures,
          accessHours: formData.accessHours,
        };
        localStorage.setItem('parkvue_saved_form', JSON.stringify(savedData));
      }

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Parking spot listed successfully!",
        },
      });

      // Clear global images array
      images.forEach(img => {
        dispatch({ type: "DELETE_IMAGE", payload: img });
      });

      // Reset form
      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        title: "",
        description: "",
        price: "",
        capacity: "1",
        isCommercial: false,
        vehicleTypes: [],
        amenities: [],
        size: "Standard",
        securityFeatures: [],
        accessHours: "24/7",
        availableFrom: "",
        availableTo: "",
      });
      
      // Reset local image and video states
      setImageUrls([]);
      setVideo(null);
      setVideoUrl("");
      setProgress({});

      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: currentUser?.uid
            ? "Failed to list parking spot. Please try again."
            : "Please log in to list a parking spot",
        },
      });
    } finally {
      setUploading(false);
    }
  };

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem('parkvue_saved_form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "auto",
        pt: 2,
        pb: 3,
        background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: isDarkMode
              ? alpha(theme.palette.background.paper, 0.85)
              : alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, isDarkMode ? 0.3 : 0.1)}`,
            boxShadow: isDarkMode
              ? "0 20px 60px rgba(0,0,0,0.4)"
              : "0 20px 60px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: theme.palette.primary.main,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              List Your Parking Spot
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Share your parking space and start earning today
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left Column: Form */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                  Address Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="New York"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="NY"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      placeholder="10001"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value="United States"
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                  Parking Details
                </Typography>

                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: 0,
                      opacity: showAIAssist ? 1 : 0,
                      pointerEvents: showAIAssist ? "auto" : "none",
                      transition: "opacity 150ms ease",
                      zIndex: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        aiAssistLoading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <AutoAwesome />
                        )
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleGenerateTitleAndDescription}
                      disabled={aiAssistLoading}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      {aiAssistLoading ? "Generating…" : "Suggest"}
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g., Spacious Downtown Parking Spot"
                      required
                      helperText="Make it descriptive and attractive"
                      onFocus={showAIAssistNow}
                      onBlur={scheduleHideAIAssist}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Describe your parking spot..."
                      multiline
                      rows={4}
                      required
                      helperText="Describe features, size, access instructions, etc."
                      onFocus={showAIAssistNow}
                      onBlur={scheduleHideAIAssist}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Daily Rate ($)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="10.00"
                      required
                      InputProps={{
                        startAdornment: "$ ",
                      }}
                      helperText="Daily rate in USD"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Spaces (Capacity)"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleChange("capacity", e.target.value)}
                      placeholder="1"
                      required
                      inputProps={{ min: 1, max: MAX_LISTING_CAPACITY, step: 1 }}
                      helperText={`Vehicles this location can hold (1-${MAX_LISTING_CAPACITY})`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Spot Size</InputLabel>
                      <Select
                        value={formData.size}
                        onChange={(e) => handleChange("size", e.target.value)}
                        label="Spot Size"
                      >
                        <MenuItem value="Compact">Compact</MenuItem>
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Large">Large</MenuItem>
                        <MenuItem value="Oversized">Oversized</MenuItem>
                      </Select>
                      <FormHelperText>Size category of each parking spot</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Available From"
                      type="datetime-local"
                      value={formData.availableFrom}
                      onChange={(e) => handleChange("availableFrom", e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="When will the parking spot be available?"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Available Until"
                      type="datetime-local"
                      value={formData.availableTo}
                      onChange={(e) => handleChange("availableTo", e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="When will the availability end?"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: { xs: 0.5, sm: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(formData.isCommercial)}
                              onChange={(e) => handleChange("isCommercial", e.target.checked)}
                            />
                          }
                          label="Commercial listing"
                        />
                        <Tooltip
                          arrow
                          title="Check this for businesses or parking lots that represent a commercial operator."
                        >
                          <IconButton size="small" sx={{ mt: -0.25 }}>
                            <InfoOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.25 }}>
                        Helps renters distinguish commercial listings from individual spots.
                      </Typography>
                    </Box>
                  </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  <CarRental sx={{ mr: 1, verticalAlign: "middle" }} />
                  Vehicle Types Allowed
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {vehicleTypeOptions.map((type) => (
                      <Grid item xs={6} sm={4} key={type}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.vehicleTypes.includes(type)}
                              onChange={(e) => {
                                const newTypes = e.target.checked
                                  ? [...formData.vehicleTypes, type]
                                  : formData.vehicleTypes.filter(t => t !== type);
                                handleChange("vehicleTypes", newTypes);
                              }}
                            />
                          }
                          label={type}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  <Security sx={{ mr: 1, verticalAlign: "middle" }} />
                  Amenities & Features
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Amenities
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {amenityOptions.map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        clickable
                        color={formData.amenities.includes(amenity) ? "primary" : "default"}
                        onClick={() => {
                          const newAmenities = formData.amenities.includes(amenity)
                            ? formData.amenities.filter(a => a !== amenity)
                            : [...formData.amenities, amenity];
                          handleChange("amenities", newAmenities);
                        }}
                        variant={formData.amenities.includes(amenity) ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Security Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {securityFeatureOptions.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        clickable
                        color={formData.securityFeatures.includes(feature) ? "primary" : "default"}
                        onClick={() => {
                          const newFeatures = formData.securityFeatures.includes(feature)
                            ? formData.securityFeatures.filter(f => f !== feature)
                            : [...formData.securityFeatures, feature];
                          handleChange("securityFeatures", newFeatures);
                        }}
                        variant={formData.securityFeatures.includes(feature) ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Map & Images */}
            <Grid item xs={12} lg={6}>
              {/* Map Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                  Location on Map
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Drag the marker to adjust the exact location
                </Typography>

                <Box
                  sx={{
                    height: { xs: 300, md: 450 },
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  }}
                >
                  <ReactMapGL
                    {...viewport}
                    onMove={(evt) => {
                      setViewport(evt.viewState);
                      handleViewportChange(evt.viewState);
                    }}
                    mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
                    mapStyle={isDarkMode
                      ? "mapbox://styles/mapbox/dark-v11"
                      : "mapbox://styles/mapbox/streets-v12"
                    }
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Marker
                      latitude={location.lat || viewport.latitude}
                      longitude={location.lng || viewport.longitude}
                      draggable
                      onDragEnd={handleMarkerDrag}
                    >
                      <LocationOn
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: 40,
                          filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.common.black, 0.3)})`,
                        }}
                      />
                    </Marker>
                    <NavigationControl position="bottom-right" />
                    <GeolocateControl
                      position="top-left"
                      trackUserLocation
                      onGeolocate={handleGeolocate}
                    />
                    <Geocoder onResult={() => { lastSourceRef.current = 'geocoder'; }} />
                  </ReactMapGL>
                </Box>
              </Box>

              {/* Image Upload Section */}
              <Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  <CloudUpload sx={{ mr: 1, verticalAlign: "middle" }} />
                  Upload Media
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Photos: Max 3. Video: Max 1 (15MB).
                </Typography>

                {/* Dropzone */}
                <Box
                  {...getRootProps()}
                  sx={{
                    p: 3,
                    mb: 3,
                    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                    borderRadius: 2,
                    bgcolor: isDragActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    {isDragActive ? "Drop files here..." : "Click or Drag & Drop"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG, MP4, WebM allowed
                  </Typography>
                </Box>

                {/* Video Preview */}
                {video && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Video Preview:</Typography>
                    <Card
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        maxWidth: 300
                      }}
                    >
                      <CardMedia
                        component="video"
                        controls
                        src={video.preview}
                        sx={{ height: 180, bgcolor: 'black' }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: alpha(theme.palette.error.main, 0.9),
                          borderRadius: "50%",
                          zIndex: 2,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={removeVideo}
                          sx={{ color: "white" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                      {progress[video.name] && progress[video.name] < 100 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: alpha(theme.palette.common.black, 0.7),
                            color: "white",
                            textAlign: "center",
                            py: 0.5,
                          }}
                        >
                          <Typography variant="caption">
                            Uploading {Math.round(progress[video.name])}%
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Box>
                )}

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Images ({images.length}/3):</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {images.map((image, index) => (
                        <Grid item xs={4} key={index}>
                          <Card
                            sx={{
                              position: "relative",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="120"
                              image={image}
                              alt={`Parking spot ${index + 1}`}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: alpha(theme.palette.error.main, 0.9),
                                borderRadius: "50%",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => removeImage(image)}
                                sx={{ color: "white" }}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Box>
                            {progress[image] && progress[image] < 100 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  bgcolor: alpha(theme.palette.common.black, 0.7),
                                  color: "white",
                                  textAlign: "center",
                                  py: 0.5,
                                }}
                              >
                                <Typography variant="caption">
                                  Uploading {Math.round(progress[image])}%
                                </Typography>
                              </Box>
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>


              {/* Save for Future Checkbox */}
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveForFuture}
                      onChange={(e) => setSaveForFuture(e.target.checked)}
                      icon={<Save />}
                      checkedIcon={<CheckCircle />}
                    />
                  }
                  label={
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Save these details for future use
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        We'll remember your preferences for next time
                      </Typography>
                    </>
                  }
                />
              </Box>
            </Grid>
          </Grid>

          {/* Submit Section */}
          <Box sx={{
            mt: 6,
            pt: 4,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            textAlign: "center"
          }}>
            {/* Upload progress indicator */}
            {(images.length > imageUrls.length || (video && !videoUrl)) && (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Uploads in progress... ({imageUrls.length}/{images.length} images{video ? ', video uploading' : ''})
                </Typography>
                <Typography variant="caption">
                  Please wait for all uploads to complete before publishing
                </Typography>
              </Alert>
            )}
            
            <Alert
              severity="info"
              sx={{
                mb: 3,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              Review all information before publishing. Once published, your spot will be visible to renters.
            </Alert>

            <Button
              variant="contained"
              size="large"
              endIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSubmit}
              disabled={uploading || imageUrls.length < images.length || (video && !videoUrl)}
              sx={{
                px: 8,
                py: 2,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                background: theme.customStyles?.neonGradient || `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: isDarkMode
                  ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.5)}`
                  : `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: isDarkMode
                    ? `0 12px 35px ${alpha(theme.palette.primary.main, 0.7)}`
                    : `0 12px 35px ${alpha(theme.palette.primary.main, 0.6)}`,
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                },
                transition: "all 0.3s ease",
                minWidth: 250,
              }}
            >
              {uploading ? "Publishing..." : "Publish Spot"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box >
  );
};

export default AddRoom;