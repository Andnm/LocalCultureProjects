import React, { ReactNode, CSSProperties } from 'react';

interface MessageProps {
  text_color: string;
  text: string;
  style?: CSSProperties;
}

const Message: React.FC<MessageProps> = ({ text_color, text, style }) => {
  return (
    <span className={text_color} style={style}>
      {text}
    </span>
  );
};

export default Message;