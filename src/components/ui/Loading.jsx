import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-4 h-4 bg-secondary-200 rounded shimmer"></div>
                <div className="w-12 h-4 bg-secondary-200 rounded shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-8 bg-secondary-200 rounded shimmer"></div>
                <div className="w-16 h-4 bg-secondary-200 rounded shimmer"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="w-32 h-6 bg-secondary-200 rounded shimmer"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-200 rounded-full shimmer"></div>
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-secondary-200 rounded shimmer"></div>
                      <div className="w-20 h-3 bg-secondary-200 rounded shimmer"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-secondary-200 rounded shimmer"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="w-28 h-6 bg-secondary-200 rounded shimmer"></div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-secondary-200 rounded shimmer"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Loading;