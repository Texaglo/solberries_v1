import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthProvider';

import axios from './api/axios';
const Raspberry_URL = '/register';

const Home = () => {
	const userRef = useRef();
	const errRef = useRef();

	const [gate, setGate] = useState('');
	const [wallet, setWallet] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [gate, wallet]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				Raspberry_URL,
				{ gate, wallet },
				{
					headers: { 'Content-Type': 'application/json' },
				}
			);

			setGate('');
			setWallet('');
			setSuccess(true);
		} catch (err) {
			console.log(err)
			if (!err?.response) {
				setErrMsg('No Server Response');
			} else if (err.response?.status === 400) {
				setErrMsg('Missing Username or Password');
			} else if (err.response?.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg('Login Failed');
			}
			errRef.current.focus();
		}
	};

	return (
		<>
				<section>
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Registration Link</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="gate">Link ID:</label>
						<input
							type="text"
							id="gate"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setGate(e.target.value)}
							value={gate}
							required
						/>

						<label htmlFor="wallet">User Wallet:</label>
						<input
							type="text"
							id="wallet"
							onChange={(e) => setWallet(e.target.value)}
							value={wallet}
							required
						/>
						<button>Register</button>
					</form>
				</section>
		</>
	);
};

export default Home;
