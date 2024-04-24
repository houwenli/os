import Layout from '@/layout';
import { systemList } from '@/qiankun/systemList';

const createRoutes = systemList.map(({ name, title, ...args }) => {
    let path = `/${name}/*`;
    return {
        path,
        name,
        component: Layout,
        meta: {
            title,
            subName: name,
            isMain: false,
            ...args,
        },
    };
});

export default [...createRoutes];
