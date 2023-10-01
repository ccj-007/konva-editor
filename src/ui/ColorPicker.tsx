
import React, { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import styled from '@emotion/styled';

interface ColorProp {
  visible: boolean,
  color: string
  setColor: (v: string) => void
}

const Popover = styled.div`
  position: absolute;
  left: 0px;
  top: 50px;
  z-index: 99999  
`;

const ColorPicker: React.FC<ColorProp> = (props) => {
  const { color = '#aabbcc', visible = false, setColor } = props

  return (
    <Popover>
      {
        visible && <HexColorPicker color={color} onChange={setColor} />
      }
    </Popover>
  );
};

export default ColorPicker;