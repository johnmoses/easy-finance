import { useBannerListQuery } from "@/gql/schemas";
import Link from "next/link";
import React, { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { Show } from "./Show";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ListProps {
  last?: number;
  isDeleted?: boolean;
}

export const carousel: React.FC<ListProps> = (props) => {
  const [selectedData, setSelectedData] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleShowModal() {
    setShowModal(!showModal);
  }

  const { loading, data, error } = useBannerListQuery({
    variables: { last: props.last, isDeleted: false },
  });

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

  return (
    <>
      <h1>Banners</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.banners?.edges.map((banner) => (
          <Card key={banner?.node?.createdAt}>
            <div
              className="relative overflow-hidden bg-cover bg-no-repeat"
              data-te-ripple-init
              data-te-ripple-color="light"
            >
              <Link href={`/banners/[id]`} as={`/banners/${banner?.node?.id}`}>
                <img
                  className="rounded-t-lg"
                  src="https://tecdn.b-cdn.net/img/new/standard/nature/186.jpg"
                  alt=""
                />
              </Link>
            </div>
            <div className="p-6">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <p>{banner?.node?.title}</p>
              </h5>
              <Link href={`/banners/[id]`} as={`/banners/${banner?.node?.id}`}>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {banner?.node?.content}
                </p>
              </Link>
            </div>
            <div className="place-self-center">
              <button
                onClick={() => {
                  toggleShowModal();
                  setSelectedData(banner?.node);
                }}
              >
                <MdMenuOpen />
              </button>
            </div>
          </Card>
        ))}
        <Show data={selectedData} open={showModal} onClose={toggleShowModal} />
      </div>
    </>
  );
};
