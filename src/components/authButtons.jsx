import { useEffect, useState } from "react";
import { getUser, handleAuthCallback, logout } from "@netlify/identity";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

async function postJson(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
}

function AuthButtons() {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(null); // "login" | "signup" | null
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            // Handles email confirmation links (#confirmation_token=...) from sign up
            try {
                const result = await handleAuthCallback();
                if (result?.type === "confirmation") {
                    setNotice("Email confirmed. You are now logged in.");
                }
            } catch {
                // Ignore invalid or expired callback tokens
            }
            setUser(await getUser());
        })();
    }, []);

    const open = (nextMode) => {
        setMode(nextMode);
        setError("");
        setNotice("");
    };
    const close = () => {
        setMode(null);
        setForm({ name: "", email: "", password: "" });
    };
    const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (mode === "signup") {
                const data = await postJson("/api/auth/signup", form);
                if (data.needsConfirmation) {
                    close();
                    setNotice("Account created. Check your email to confirm it, then log in.");
                    return;
                }
            } else {
                await postJson("/api/auth/login", { email: form.email, password: form.password });
            }
            // Full reload so the browser picks up the new session cookie
            window.location.reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await postJson("/api/auth/logout", {});
        } catch {
            // Fall through to clear the browser session anyway
        }
        try {
            await logout();
        } catch {
            // Session may already be gone
        }
        window.location.reload();
    };

    if (user) {
        return (
            <>
                <span className="text-black me-1">Hi, {user.name || user.email}</span>
                <Button variant="outline-dark" onClick={handleLogout}>Log Out</Button>
            </>
        );
    }

    return (
        <>
            <Button variant="outline-dark" onClick={() => open("login")}>Log In</Button>
            <Button variant="dark" onClick={() => open("signup")}>Sign Up</Button>

            <Modal show={!!notice && !mode} onHide={() => setNotice("")} centered>
                <Modal.Body>{notice}</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setNotice("")}>OK</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={!!mode} onHide={close} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{mode === "signup" ? "Create your account" : "Log in to Notesy"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {mode === "signup" && (
                            <Form.Group className="mb-3" controlId="authName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control name="name" value={form.name} onChange={update} autoComplete="name" />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3" controlId="authEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={update} required autoComplete="email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="authPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={update}
                                required
                                minLength={6}
                                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                            />
                        </Form.Group>
                        <div className="text-center">
                            {mode === "signup" ? (
                                <span>Already have an account? <Button variant="link" className="p-0" onClick={() => open("login")}>Log in</Button></span>
                            ) : (
                                <span>New to Notesy? <Button variant="link" className="p-0" onClick={() => open("signup")}>Sign up</Button></span>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={close}>Cancel</Button>
                        <Button type="submit" className="bg-custom" disabled={loading}>
                            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Log In"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
export default AuthButtons;
