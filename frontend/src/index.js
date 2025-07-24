// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { ConfigProvider, App as AntdApp } from 'antd';
// import App from './App';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <ConfigProvider>
//       <AntdApp>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
    
//       </AntdApp>
//       </ConfigProvider>
//   </React.StrictMode>
// );






import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, notification } from 'antd';
import App from './App';
import './index.css';

const Root = () => {
  // Move hook inside component
  const [api, contextHolder] = notification.useNotification();

  // Make available globally (careful with this pattern)
  window.showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      duration: 3,
    });
  };

  return (
    <ConfigProvider>
      <AntdApp>
        {contextHolder}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);