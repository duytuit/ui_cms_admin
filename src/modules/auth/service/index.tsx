import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Button} from 'primereact/button';
import { Checkbox} from 'primereact/checkbox';

export const FormAuth = (props:any) => {
    const { title, subtitle, linkSubtitle, handleSubmit, lableSubmit, titleFooter, linkTitleFooter, loading, rememberPassword, disabled } = props;

    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-column align-items-center justify-content-center">
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{title}</div>
                            {linkSubtitle ? (
                                <Link to={linkSubtitle}>
                                    <Button icon="pi pi-arrow-left" label={subtitle} text />
                                </Link>
                            ) : <span className="text-600 font-medium">{subtitle}</span>}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {props.children}

                            {titleFooter && <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    {rememberPassword && (
                                        <Fragment>
                                            <Checkbox checked={false} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme">Remember me</label>
                                        </Fragment>
                                    )}
                                </div>
                                <Link to={linkTitleFooter} className="font-medium no-underline text-right" style={{ color: 'var(--primary-color)' }}>
                                    {titleFooter}
                                </Link>
                            </div>}
                            <Button disabled={disabled} loading={loading} label={lableSubmit || 'Submit'} className="w-full p-3 text-xl" ></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

