import '../css/Profile.css';

const user = {
    name: 'YOO',
    imageUrl: 'https://preview.redd.it/fallen-angels-v0-wdk2688j5hec1.png?width=1080&crop=smart&auto=webp&s=dec90ac7d89e770013c18158aa595474ce4a68d4',
    imageSize: 150,
  };

  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

const Profile = () => {
    const generateTransform = () => {
        const a = getRandomNumber(0.5, 2); // Random number between 0.5 and 2
        const b = getRandomNumber(0.5, 2); // Random number between 0.5 and 2
        const c = getRandomNumber(-1, 1); // Random number between -1 and 1
        const d = getRandomNumber(0.5, 2); // Random number between 0.5 and 2
        const e = getRandomNumber(-10, 5); // Random number between -10 and 10
        const f = getRandomNumber(-10, 2); // Random number between -10 and 10

        return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    };

    return (
        <a href="/">
            <img
                className="avatar"
                src={user.imageUrl}
                alt={'Photo of ' + user.name}
                style={{ transition: 'transform .6s ease-in-out' }}
                onMouseEnter={(e) => e.target.style.transform = generateTransform()}
                onMouseLeave={(e) => e.target.style.transform = 'none'}
            />
        </a>
    );
}

export default Profile;