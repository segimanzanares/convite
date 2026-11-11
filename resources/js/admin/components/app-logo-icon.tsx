import type { ImgHTMLAttributes } from 'react';
import conviteIcon from '../../assets/images/convite-icon.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={conviteIcon} alt="" aria-hidden="true" {...props} className={`object-contain ${props.className ?? ''}`} />;
}
