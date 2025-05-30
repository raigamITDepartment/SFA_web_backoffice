import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SequenceTable from './Components/SequenceTable';


const HeaderFooter = () => {
    const headerExtraContent = null;


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
                    content: 'Item Sequence',
                    extra: headerExtraContent,
                }}
                footer={{
                    content: cardFooter,
                }}
            >
                <SequenceTable />
            </Card>
        </div>
    );
};


export default HeaderFooter;