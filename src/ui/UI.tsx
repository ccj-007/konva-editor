import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import RectangleIcon from '@mui/icons-material/Rectangle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import RouteIcon from '@mui/icons-material/Route';
import NearMeIcon from '@mui/icons-material/NearMe';
import TitleIcon from '@mui/icons-material/Title';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useStore from '../store';
import { ShapeProps, SpriteType } from '../types/sprite';
import { downloadURI } from '../utils';
import Konva from 'konva';
import ColorPicker from './ColorPicker';
import { createGroupSprite } from '../draw/createSpriteObj';
import _ from 'lodash';

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
  const { setDrawSpriteType, stage, drawSpriteType, selects, setSelects, sprites, setSprites } = useStore();

  const [formats, setFormats] = React.useState(() => ['']);
  const [visibleColorPicker, setVisibleColorPicker] = React.useState(false);
  const [color, setColor] = React.useState('#aabbcc');

  React.useEffect(() => {
    selects.forEach((n: Konva.Node) => n.fill(color))
  }, [color])

  /** 文本编辑 */
  const handleFormat = (
    _event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
    setVisibleColorPicker(newFormats.includes('color'))

    selects.forEach((n: Konva.Node) => {
      if (n.attrs.name === 'TEXT') {
        if (newFormats.includes('bold')) {
          (n as Konva.Text).fontStyle('bold');
        } else if (newFormats.includes('italic')) {
          (n as Konva.Text).fontStyle('italic');
        } else {
          (n as Konva.Text).fontStyle('normal');
        }
        (n as Konva.Text).textDecoration(newFormats.includes('underlined') ? 'underlined' : 'normal');
      }
      n.fill(color)
    })
  };

  const handleSprite = (
    _event: React.MouseEvent<HTMLElement>,
    sprite: SpriteType
  ) => {
    setDrawSpriteType(sprite);
  };

  const handleEdit = (_event: React.MouseEvent<HTMLElement>, edit: string) => {
    if (selects) {
      let spriteCopy = _.cloneDeep(sprites)
      let min = 0, max = 0, center = 0
      const mins: number[] = []
      const maxs: number[] = []
      selects.forEach((select: Konva.Node) => {
        if (select.name() === 'CIRCLE') {
          mins.push(select.x() - select.radius())
          maxs.push(select.x() + select.radius())
        } else if (select.name() === 'GROUP') {
          const size = select.getClientRect()
          mins.push(size.x)
          maxs.push(size.x + size.width)
        } else {
          mins.push(select.x())
          maxs.push(select.x() + select.width())
        }
      })
      console.log(mins, maxs);

      min = Math.min(...mins)
      max = Math.max(...maxs)
      center = min + (max - min) * 0.5

      switch (edit) {
        case 'left':
          selects.forEach(select => {
            if (select.name() === 'CIRCLE') {
              select.x(min + select.radius())
            } else if (select.name() === 'GROUP') {
              const size = select.getClientRect()
              const relativeX = min - size.x
              select.x(relativeX)
            } else {
              select.x(min)
            }
          })
          break;
        case 'center':
          selects.forEach(select => {
            if (select.attrs.name === 'CIRCLE') {
              select.x(center)
            } else if (select.name() === 'GROUP') {
              const size = select.getClientRect()
              const relativeX = -(size.x - center)
              select.x(relativeX - size.width * 0.5)
            } else {
              select.x(center - select.width() * 0.5)
            }
          })
          break;
        case 'right':
          selects.forEach(select => {
            if (select.attrs.name === 'CIRCLE') {
              select.x(max - select.radius())
            } else if (select.name() === 'GROUP') {
              const size = select.getClientRect()
              const relativeX = max - (size.x + size.width)
              console.log(relativeX);
              select.x(relativeX)
            } else {
              select.x(max - select.width())
            }
          })
          break;
        case 'up':
          selects.forEach(s => {
            s.moveToTop();
            stage?.findOne(`#Transformer${s.id()}`)?.moveToTop();
            stage?.findOne(`#marquee`)?.moveToTop();
          })
          break;
        case 'down':
          selects.forEach(s => s.moveToBottom())
          break;
        case 'hide':
          selects.forEach(s => s.hide())
          break;
        case 'show':
          selects.forEach(s => s.show())
          break;
        case 'delete':
          selects.forEach(s => {
            s.destroy();
            stage?.findOne(`#Transformer${s.id()}`)?.destroy();
          })

          break;
        case 'image':
          const dataURL = stage?.toDataURL({
            pixelRatio: 2 // 或您需要的其他值
          }) as string
          downloadURI(dataURL, 'stage.png')
          break;
        case 'addGroup':
          // 当只有一个节点并为组的时候不生效
          if (selects.length === 1 && selects[0].name() === 'GROUP') return
          // 找到所有节点删除
          let children: ShapeProps[] = []
          selects.forEach(s => {
            let idx = spriteCopy.findIndex(s2 => s2.id === s.id())
            if (idx > -1) {
              children.push(spriteCopy[idx])
              spriteCopy.splice(idx, 1)
            }
          })

          // 重新生成组合节点
          const group = createGroupSprite({
            children
          })
          spriteCopy.push(group)

          setSprites(spriteCopy)
          setTimeout(() => {
            if (stage) {
              const groupNode = stage.findOne(`#${group.id}`) as Konva.Group
              setSelects([groupNode])
            }
          }, 0);
          break;
        case 'removeGroup':
          selects.forEach(s => {
            if (s.name() === 'GROUP') {
              const id = s.id()
              // 找到组的子节点
              let children: ShapeProps[] = []
              s.children.forEach((item) => {
                const node = stage.findOne(`#${item.id()}`)
                const size = node?.getClientRect()
                const skipSize = node?.getClientRect({
                  skipTransform: true
                })
                const ro = node?.getAbsoluteRotation()

                if (item.attrs.name === 'CIRCLE') {
                  item.attrs = { ...item.attrs, x: size?.x + skipSize.width * .5, y: size?.y + skipSize.height * .5, radius: skipSize.width * .5 }
                } else {
                  item.attrs = { ...item.attrs, ...size, width: skipSize?.width, height: skipSize?.height }
                }
                children.push(item.attrs)
              })
              // 在sprites把组删除
              const idx = spriteCopy.findIndex(s => s.id === id)
              if (idx > -1) {
                spriteCopy.splice(idx, 1)
                spriteCopy = [...spriteCopy, ...children]
              }
              // 在sprites中生成新的子节点
              setSprites(spriteCopy)
              setSelects([])
            }
          })
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

        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        {/* 样式编辑 */}
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
          <ToggleButton value='color' aria-label='color' style={{ color: color }} >
            <RectangleIcon />
            <ColorPicker color={color} setColor={(v) => setColor(v)} visible={visibleColorPicker}></ColorPicker>
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
          <ToggleButton value='TEXT' aria-label='text'>
            <TitleIcon />
          </ToggleButton>
          <ToggleButton value='RECT' aria-label='rect'>
            <CropSquareIcon />
          </ToggleButton>
          <ToggleButton value='CIRCLE' aria-label='circle'>
            <PanoramaFishEyeIcon />
          </ToggleButton>
          <ToggleButton value='CURVE' aria-label='curve'>
            <RouteIcon />
          </ToggleButton>
          <ToggleButton value='' aria-label='select'>
            <NearMeIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        {/* 通用编辑 */}
        <StyledToggleButtonGroup
          size='small'
          value={''}
          exclusive
          onChange={handleEdit}
          aria-label='text formatting'
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
          <ToggleButton value='addGroup' aria-label='add group'>
            <GroupAddIcon />
          </ToggleButton>
          <ToggleButton value='removeGroup' aria-label='remove group'>
            <GroupRemoveIcon />
          </ToggleButton>
          <ToggleButton value='image' aria-label='export image'>
            <ImageIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
    </div >
  );
}
