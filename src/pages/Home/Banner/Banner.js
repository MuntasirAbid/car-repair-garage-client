import React from 'react';
import image1 from '../../../assets/images/banner/1.jpg'
import image2 from '../../../assets/images/banner/2.jpg'
import image3 from '../../../assets/images/banner/3.jpg'
import image4 from '../../../assets/images/banner/4.jpg'
import image5 from '../../../assets/images/banner/5.jpg'
import image6 from '../../../assets/images/banner/6.jpg'
import BannerItem from './BannerItem';

const bannerData = [
    {
        image: image1,
        prev: 6,
        id: 1,
        next: 2
    },
    {
        image: image2,
        prev: 1,
        id: 2,
        next: 3
    },
    {
        image: image3,
        prev: 2,
        id: 3,
        next: 4
    },
    {
        image: image4,
        prev: 3,
        id: 4,
        next: 5
    },
    {
        image: image5,
        prev: 4,
        id: 5,
        next: 6
    },
    {
        image: image6,
        prev: 5,
        id: 6,
        next: 1
    }
]

const Banner = () => {
    return (
        <div className="carousel w-full py-4">

            {
                bannerData.map(slide => <BannerItem
                    key={slide.id}
                    slide={slide}
                ></BannerItem>)
            }

        </div>
    );
};

export default Banner;