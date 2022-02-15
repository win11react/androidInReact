import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPlayer from 'react-player';

import Slider from '@mui/material/Slider';

import { dispatchAction } from 'store/actions';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import * as FaRegIcons from '@fortawesome/free-regular-svg-icons';
import * as MUIcons from '@mui/icons-material';
import * as AllIcons from 'components/icons';

const {round, floor, random, min, max, abs} = Math;

export const MaterialIcon = (props) => {
  var icon = props.mui;
  if (props.out) icon += "Outlined";
  if (props.round) icon += "Rounded";
  if (props.twotone) icon += "TwoTone";
  if (props.sharp) icon += "Sharp";

  // const Icon = <div></div>
  const MuiIcon = MUIcons[icon];
  return (
    <MuiIcon
      className={
        props.flip? "flip-true": "" +
        (props.invert? " invert-true": "") +
        (props.rounded? " rounded-true": "")
      } style={{
        width: props.w,
        height: props.h || props.w,
        color: props.color,
        margin: props.margin,
      }}
    />
  );
};

export const Icon = (props) => {
  var src = `/img/icon/${props.ui ? "ui/" : ""}${props.src}`;
  if (props.src && !props.src.includes(".")) {
    src += ".png";
  }

  if (props.ext || (props.src && props.src.includes("http"))) {
    src = props.src;
  }

  var dataset = {}
  Object.entries(props).forEach(([key, value]) => {
    if(key.includes("data-")){
      dataset[key] = value;
    }
  });

  var classname = `uicon prtclk ${props.className || ""}`.trim()
  var styles = {
    borderRadius: props.radii
  }

  if (props.fafa) {
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <FontAwesomeIcon
          data-flip={props.flip}
          data-invert={props.invert}
          data-rounded={props.rounded}
          style={{
            width: props.w,
            height: props.h || props.w,
            color: props.color,
            margin: props.margin
          }}
          icon={!props.reg ? FaIcons[props.fafa] : FaRegIcons[props.fafa]}
        />
      </div>
    );
  } else if (props.mui) {
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <MaterialIcon {...props} />
      </div>
    );
  }else if (props.icon) {
    var CustomIcon = AllIcons[props.icon];
    return (
      <div className={classname} {...dataset} style={styles}
        onClick={props.onClick || (props.action && dispatchAction)}
        data-action={props.action} data-payload={props.payload}>
        <CustomIcon {...props} />
      </div>
    );
  } else {
    return (
      <div className={classname} data-active={props.active} {...dataset}
        data-action={props.action} data-payload={props.payload}
        onClick={props.onClick || dispatchAction} style={styles}>
        <img width={props.w} height={props.h} data-flip={props.flip}
          data-invert={props.invert} data-rounded={props.rounded}
          src={src} style={{ margin: props.margin}}
          alt={props.alt || ""}/>
      </div>
    );
  }
};

export const Image = (props) => {
  const dispatch = useDispatch();
  var src = `/img/${(props.dir?props.dir+"/":"")+props.src}`;
  if (props.src && !props.src.includes(".")) {
    src += ".png";
  }

  if (props.ext || (props.src && props.src.includes("http"))) {
    src = props.src;
  }

  const errorHandler = (e)=>{
    if(props.err) e.target.src = props.err
  }

  var dataset = {}
  Object.entries(props).forEach(([key, value]) => {
    if(key.includes("data-")){
      dataset[key] = value;
    }
  });

  return (
    <div className={`imageCont prtclk ${props.className||''}`} id={props.id} style={{
      backgroundImage: props.back && `url(${src})`
    }} data-back={props.back} onClick={props.onClick || (props.action && dispatchAction)}
      data-action={props.action} data-payload={props.payload} {...dataset}>
        {!props.back?<img
          width={props.w}
          height={props.h}
          data-free={props.free}
          data-var={props.var}
          loading={props.lazy && "lazy"}
          src={src} alt="" onError={errorHandler}/>:null}
    </div>
  )
}

const formatseconds = (sec)=>{
  if (!sec) return "00:00";
  var res = floor(sec / 60);
  res += ':';
  sec %= 60;
  if (sec < 10) res += "0";
  res += sec;

  return res;
}

export const Video = (props) => {
  const dispatch = useDispatch();
  const [play, setPlay] = useState(props.autoplay);
  const [prog, setProg] = useState(0); // time elapsed
  const [perProg, setPerProg] = useState(0); // time elapsed in %

  var src = `/img/${(props.dir?props.dir+"/":"")+props.src}`;
  if (props.src && !props.src.includes(".")) src += ".mp4";

  if (props.ext || (props.src && props.src.includes("http"))) {
    src = props.src;
  }

  const className = `vidCont ${props.inactive?'prtclk':''} ${props.className||''}`.trim()
  var dataset = {}
  Object.entries(props).forEach(([key, value]) => {
    if(key.includes("data-")){
      dataset[key] = value
    }
  });

  const handlePause = (e) => setPlay(false)
  const handlePlay = (e) => setPlay(true)

  const handleProg = (e)=>{
    setProg(floor(e.playedSeconds))
    setPerProg(e.played)
  }

  return (
    <div className={className} id={props.id}
      onClick={props.onClick || (props.action && dispatchAction)}
      data-action={props.action} data-payload={props.payload} {...dataset} tabIndex="1">
        {!props.playIcon && play &&
          <Icon className="play-icon" mui="Pause" round w={48} onClick={handlePause}/>}
        {!props.playIcon && !play &&
          <Icon className="play-icon opacity-100" mui="PlayArrow" round w={48} onClick={handlePlay}/>}
        {props.playIcon}
        <ReactPlayer className="react-video"
          url={src}
          width={props.w || "auto"}
          height={props.h || "auto"}
          controls={props.controls} playing={props.play || play}
          onPlay={props.onPlay || handlePlay} onPause={props.onPause || handlePause}
          onProgress={props.onProgress || handleProg} onEnded={props.onEnded || handlePause}/>
        {props.cstmctrl && (
          <div className="video-control-container">
            <span className="prog-text">{formatseconds(prog)}</span>
            <Slider size="small"
              className="video-progress"
              value={perProg*100}
              defaultValue={0}
            />
            <span className="prog-text">{formatseconds(floor(prog/perProg))}</span>
          </div>
        )}
    </div>
  )
}

export const LazyComponent = ({ show, children }) => {
  const [loaded, setLoad] = useState(false);

  useEffect(() => {
    if (show && !loaded) setLoad(true);
  }, [show]);

  return show || loaded ? <>{children}</> : null;
};
