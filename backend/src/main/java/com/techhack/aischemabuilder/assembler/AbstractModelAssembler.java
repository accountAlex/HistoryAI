package com.techhack.aischemabuilder.assembler;

import org.springframework.data.domain.Page;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractModelAssembler<T, D extends RepresentationModel<?>>
    implements RepresentationModelAssembler<T, D> {

    @NonNull
    public List<D> toModelList(@NonNull Iterable<? extends T> entities) {
        List<D> models = new ArrayList<>();

        for (T t : entities) {
            models.add(toModel(t));
        }

        return models;
    }

    @NonNull
    public PagedModel<D> toPagedModel(@NonNull Page<T> page) {
        List<D> models = toModelList(page.getContent());

        PagedModel.PageMetadata metadata = new PagedModel.PageMetadata(
            page.getSize(), page.getNumber(), page.getTotalElements(), page.getTotalPages()
        );

        return PagedModel.of(models, metadata);
    }

}

