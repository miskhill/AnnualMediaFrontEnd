import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

const Login = () => {
  const { login, isAuthenticated, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formState.email, formState.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const disableSubmit =
    isAuthenticating || !formState.email.trim() || !formState.password.trim();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 6, md: 10 },
        background: "radial-gradient(circle at top, #1f2937, #0f172a)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          p: { xs: 3, md: 5 },
          backdropFilter: "blur(6px)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            Annual Media
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
          aria-label='login form'
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formState.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formState.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={disableSubmit}
            sx={{
              mt: 1,
              py: 1.4,
              fontWeight: 600,
              backgroundColor: "#e50914",
              "&:hover": { backgroundColor: "#b20710" },
            }}
          >
            {isAuthenticating ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          sx={{ mt: 3 }}
        >
          Access is limited to pre-created accounts.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
