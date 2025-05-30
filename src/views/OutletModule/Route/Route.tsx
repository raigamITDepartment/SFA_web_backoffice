import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FilterForm from './Components/FilterForm';
import RouteTable from './Components/RouteTable';

const Route = () => {
    const headerExtraContent = <FilterForm />;

    const cardFooter = (
        <div className="flex justify-end">
            <Button size="sm" className="ltr:mr-2 rtl:ml-2">
                Cancel
            </Button>
            <Button size="sm" variant="solid">
                Submit
            </Button>
        </div>
    );

    return (
        <div>
            <Card
                header={{
                    content: 'Route Table',
                    extra: headerExtraContent,
                }}
                footer={{
                    content: cardFooter,
                }}
            >
                <RouteTable />
            </Card>
        </div>
    );
};

export default Route;


