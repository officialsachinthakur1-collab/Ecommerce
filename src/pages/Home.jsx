import Hero from '../components/home/Hero';
import ValueProps from '../components/home/ValueProps';
import ProductGrid from '../components/home/ProductGrid';
import SplitFeatured from '../components/home/SplitFeatured';
import Marquee from '../components/home/Marquee';
import Testimonials from '../components/home/Testimonials';
import BlogGrid from '../components/home/BlogGrid';

const Home = () => {
    return (
        <>
            <Hero />
            <ValueProps />
            <ProductGrid />
            <SplitFeatured
                title="For Him"
                subtitle="Engineered for the modern athlete. Precision meets power."
                buttonText="Shop Men"
                linkTo="/shop?category=Men"
                imageLeft={false}
            />
            <Marquee />
            <SplitFeatured
                title="For Her"
                subtitle="Uncompromising style and performance. Defined by you."
                buttonText="Shop Women"
                linkTo="/shop?category=Women"
                imageLeft={true}
            />
            <Testimonials />
            <BlogGrid />
        </>
    );
};

export default Home;
