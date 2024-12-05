import { useBannerListQuery } from "@/gql/schemas";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";
import { apixURL } from "@/clients/utils";
import Image from "next/image";

interface ListProps {
  last?: number;
}

export const List: React.FC<ListProps> = (props) => {
  const { loading, data, error } = useBannerListQuery({
    variables: { last: props.last, isDeleted: false },
  });

  const plugin = React.useRef(
    // Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (loading) {
    return (
      <div className="text-center">
      <Progress value={33} />
      </div>
    );
  }

  if (error) {
    return <div>No Data</div>;
  }

  // return (
  //   <Carousel
  //     className="w-full max-w-xs"
  //     plugins={[plugin.current]}
  //     onMouseEnter={plugin.current.stop}
  //     onMouseLeave={plugin.current.reset}
  //   >
  //     <CarouselContent>
  //       {data?.banners?.edges.map((banner, index) => (
  //         <CarouselItem key={index} className="">
  //           <div className="">
  //             <Card className="">
  //               <CardContent className="relative h-56 overflow-hidden rounded-lg md:h-96">
  //                 <Link
  //                   href={`/banners/[id]`}
  //                   as={`/banners/${banner?.node?.id}`}
  //                 >
  //                   <Image
  //                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  //                     src={`${apixURL}/static/uploads/banners/${banner?.node?.pic}`}
  //                     layout="fill"
  //                     // fill
  //                     // objectFit="cover"
  //                     className="absolute block w-full "
  //                     alt="..."
  //                     style={{ objectFit: "cover" }}
  //                   />
  //                 </Link>
  //               </CardContent>
  //             </Card>
  //           </div>
  //         </CarouselItem>
  //       ))}
  //     </CarouselContent>
  //     <CarouselPrevious />
  //     <CarouselNext />
  //   </Carousel>
  // );
};
