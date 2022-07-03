import Header from './Header';
import SignIn from './SignIn';
import TinderCards from './TinderCards';

function Home() {
	const jwtToken = window.localStorage.getItem('jwtToken');
	
	return (
	<div >
		{jwtToken ? (
		<div>
			<Header />
			<TinderCards jwtToken={jwtToken}/>
		</div>
		):(
		<SignIn/>
		)
		}
	</div>
	);
}

export default Home;