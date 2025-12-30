import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import useFetchStats from "./sales/hooks/useFetchStats";
import useUser from "../auth/useUser";
import { ReactNode } from "react";

const AdminHome = () => {

  const {userId}  = useUser();
  const { data, isLoading } = useFetchStats(userId ?? '');

  if(!data || isLoading){
    return <p>Loading Stats...</p>
  }
  return (
    <div className="container my-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-4">       
        <StatCard title="Students">
          {formatNumber(data.totalStudents)}
        </StatCard>
        <StatCard title="Products">
          {formatNumber(data.totalProducts)}
        </StatCard>
        <StatCard title="Courses">
          {formatNumber(data.totalCourses)}
        </StatCard>
        <StatCard title="CourseSections">
          {formatNumber(data.totalCourseSections)}
        </StatCard>
        <StatCard title="Lessons">
          {formatNumber(data.totalLessons)}
        </StatCard>
    </div>
    </div>
  )
}
export default AdminHome;

function StatCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="font-bold text-2xl">{children}</CardTitle>
      </CardHeader>
    </Card>
  )
}