const user = {
    name: 'YOO',
    imageUrl: 'https://preview.redd.it/fallen-angels-v0-wdk2688j5hec1.png?width=1080&crop=smart&auto=webp&s=dec90ac7d89e770013c18158aa595474ce4a68d4',
    imageSize: 150,
  };
  
  export default function Profile() {
    return (
      <>
        <a href="/">
          <img
            className="avatar"
            src={user.imageUrl}
            alt={'Photo of ' + user.name}
            style={{
              marginTop: '30px',
              width: user.imageSize,
              height: user.imageSize,
              cursor: 'pointer',
              borderRadius: 80,
              display: 'block',
              margin: 'auto'
            }}
          />
        </a>
      </>
    );
  }