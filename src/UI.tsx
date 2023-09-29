import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NearMeIcon from '@mui/icons-material/NearMe';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useStore from './store';
import { SpriteType } from './types/sprite';
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default function UI() {
  const { setDrawSpriteType } = useStore();
  const drawSpriteType = useStore((state) => state.drawSpriteType);
  const target = useStore((state) => state.target);

  const [alignment, setAlignment] = React.useState('left');
  const [formats, setFormats] = React.useState(() => ['italic']);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    console.log(newAlignment);

    setAlignment(newAlignment);
  };

  const handleSprite = (
    event: React.MouseEvent<HTMLElement>,
    sprite: SpriteType
  ) => {
    setDrawSpriteType(sprite);
  };
  const handleEdit = (event: React.MouseEvent<HTMLElement>, edit: string) => {
    if (target) {
      switch (edit) {
        case 'up':
          target.moveToTop();
          break;
        case 'down':
          target.moveToBottom();
          break;
        case 'hide':
          target.hide();
          break;
        case 'show':
          target.show();
          break;
        case 'delete':
          target.destroy();
          break;
        default:
          break;
      }
    }
  };
  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
        }}
      >
        {/* 对齐 */}
        <StyledToggleButtonGroup
          size='small'
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label='text alignment'
        >
          <ToggleButton value='left' aria-label='left aligned'>
            <FormatAlignLeftIcon />
          </ToggleButton>
          <ToggleButton value='center' aria-label='centered'>
            <FormatAlignCenterIcon />
          </ToggleButton>
          <ToggleButton value='right' aria-label='right aligned'>
            <FormatAlignRightIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        {/* 文本编辑 */}
        <StyledToggleButtonGroup
          size='small'
          value={formats}
          onChange={handleFormat}
          aria-label='text formatting'
        >
          <ToggleButton value='bold' aria-label='bold'>
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value='italic' aria-label='italic'>
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value='underlined' aria-label='underlined'>
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value='color' aria-label='color'>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        {/* 几何体 */}
        <StyledToggleButtonGroup
          size='small'
          value={drawSpriteType}
          exclusive
          onChange={handleSprite}
          aria-label='text formatting'
        >
          <ToggleButton value='RECT' aria-label='rect'>
            <CropSquareIcon />
          </ToggleButton>
          <ToggleButton value='CIRCLE' aria-label='circle'>
            <PanoramaFishEyeIcon />
          </ToggleButton>
          <ToggleButton value='' aria-label='select'>
            <NearMeIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        {/* 通用编辑 */}
        <StyledToggleButtonGroup
          size='small'
          value={drawSpriteType}
          exclusive
          onChange={handleEdit}
          aria-label='text formatting'
        >
          <ToggleButton value='up' aria-label='bring to front'>
            <FlipToFrontIcon />
          </ToggleButton>
          <ToggleButton value='down' aria-label='bring to back'>
            <FlipToBackIcon />
          </ToggleButton>
          <ToggleButton value='show' aria-label='visible'>
            <VisibilityIcon />
          </ToggleButton>
          <ToggleButton value='hide' aria-label='visible off'>
            <VisibilityOffIcon />
          </ToggleButton>
          <ToggleButton value='delete' aria-label='delete'>
            <DeleteIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
}
